const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const appDir = path.join(projectRoot, "app");
const libDir = path.join(appDir, "lib");
const tsconfigPath = path.join(projectRoot, "tsconfig.json");

const moduleFileExtensions = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mts",
  ".mjs",
  ".cjs",
];

const indexFileNames = [
  "index.ts",
  "index.tsx",
  "index.js",
  "index.jsx",
  "index.mts",
  "index.mjs",
  "index.cjs",
];

/** @type {Map<string, Array<{ filePath: string; importName: string; kind: "value" | "type" }>>} */
const exportIndex = new Map();

/** @type {Set<string>} */
const processedFiles = new Set();

/** @type {Set<string>} */
const modifiedFiles = new Set();

/** @type {Array<{ aliasPrefix: string; pathPrefix: string; hasWildcard: boolean; pathPrefixWithSep: string }>} */
const aliasMappings = [];

function loadAliasMappings() {
  if (!fs.existsSync(tsconfigPath)) {
    return;
  }

  let tsconfig;
  try {
    tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  } catch (error) {
    console.warn("[fix-imports] Failed to read tsconfig.json:", error);
    return;
  }

  const pathsConfig = tsconfig?.compilerOptions?.paths ?? {};
  for (const [alias, targets] of Object.entries(pathsConfig)) {
    if (!Array.isArray(targets)) continue;
    const aliasHasWildcard = alias.includes("*");
    const aliasPrefix = aliasHasWildcard
      ? alias.replace(/\*.*$/, "")
      : alias;

    targets.forEach((target) => {
      if (typeof target !== "string") return;
      const targetHasWildcard = target.includes("*");
      const targetPrefixRaw = targetHasWildcard
        ? target.replace(/\*.*$/, "")
        : target;
      const resolvedTargetPrefix = path.resolve(projectRoot, targetPrefixRaw);
      const normalizedPrefix = path.normalize(resolvedTargetPrefix);
      const pathPrefixWithSep = normalizedPrefix.endsWith(path.sep)
        ? normalizedPrefix
        : normalizedPrefix + path.sep;

      aliasMappings.push({
        aliasPrefix,
        pathPrefix: normalizedPrefix,
        hasWildcard: aliasHasWildcard,
        pathPrefixWithSep,
      });
    });
  }

  aliasMappings.sort(
    (a, b) => b.pathPrefix.length - a.pathPrefix.length
  );
}

loadAliasMappings();

function isIgnoredDir(name) {
  return (
    name === "node_modules" ||
    name === ".next" ||
    name === ".git" ||
    name === ".turbo"
  );
}

function isTypeOnlyKind(nodeKind) {
  return (
    nodeKind === ts.SyntaxKind.InterfaceDeclaration ||
    nodeKind === ts.SyntaxKind.TypeAliasDeclaration
  );
}

function collectExportForName(name, info) {
  if (!name) {
    return;
  }
  if (!exportIndex.has(name)) {
    exportIndex.set(name, []);
  }
  exportIndex.get(name).push(info);
}

function collectExportsFromFile(filePath) {
  const ext = path.extname(filePath);
  if (!moduleFileExtensions.includes(ext)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const scriptKind = ext === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );

  function resolveModuleAbsolute(moduleSpecifier) {
    return resolveModuleBasePath(filePath, moduleSpecifier);
  }

  function visit(node) {
    if (ts.isExportAssignment(node)) {
      if (!node.isExportEquals) {
        collectExportForName("default", {
          filePath,
          importName: "default",
          kind: "value",
        });
      }
      return;
    }

    if (
      ts.isFunctionDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isVariableStatement(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node)
    ) {
      const modifiers = node.modifiers ?? [];
      const hasExport = modifiers.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
      );
      if (!hasExport) {
        ts.forEachChild(node, visit);
        return;
      }

      if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach((declaration) => {
          if (ts.isIdentifier(declaration.name)) {
            collectExportForName(declaration.name.text, {
              filePath,
              importName: declaration.name.text,
              kind: "value",
            });
          }
        });
        return;
      }

      const name = node.name ? node.name.text : undefined;
      if (!name && modifiers.length === 0) {
        ts.forEachChild(node, visit);
        return;
      }
      const hasDefault = modifiers.some(
        (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword
      );

      if (hasDefault) {
        collectExportForName("default", {
          filePath,
          importName: "default",
          kind: isTypeOnlyKind(node.kind) ? "type" : "value",
        });
      } else if (name) {
        collectExportForName(name, {
          filePath,
          importName: name,
          kind: isTypeOnlyKind(node.kind) ? "type" : "value",
        });
      }
      ts.forEachChild(node, visit);
      return;
    }

    if (ts.isExportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier
        ? node.moduleSpecifier.getText().slice(1, -1)
        : undefined;
      if (!node.exportClause) {
        // export * from './module'
        if (moduleSpecifier) {
          const resolved = resolveModulePath(filePath, moduleSpecifier);
          if (resolved) {
            collectExportForName("*", {
              filePath: resolved,
              importName: "*",
              kind: "value",
            });
          }
        }
        return;
      }
      if (ts.isNamedExports(node.exportClause)) {
        const basePath = moduleSpecifier
          ? resolveModuleAbsolute(moduleSpecifier)
          : filePath;
        node.exportClause.elements.forEach((element) => {
          const exportName = element.name.text;
          const importName = element.propertyName
            ? element.propertyName.text
            : element.name.text;
          const kind =
            element.isTypeOnly || node.isTypeOnly ? "type" : "value";

          if (moduleSpecifier && basePath) {
            collectExportForName(exportName, {
              filePath: basePath,
              importName,
              kind,
            });
          } else {
            collectExportForName(exportName, {
              filePath,
              importName,
              kind,
            });
          }
        });
      }
      return;
    }

    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
}

function walkAndCollectExports(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (isIgnoredDir(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkAndCollectExports(fullPath);
    } else if (entry.isFile()) {
      collectExportsFromFile(fullPath);
    }
  }
}

function resolveModuleBasePath(fromFile, moduleSpecifier) {
  if (!moduleSpecifier) return null;
  for (const mapping of aliasMappings) {
    if (!moduleSpecifier.startsWith(mapping.aliasPrefix)) {
      continue;
    }
    const remainder = moduleSpecifier.slice(mapping.aliasPrefix.length);
    const candidatePath = mapping.hasWildcard
      ? path.join(mapping.pathPrefix, remainder)
      : mapping.pathPrefix;
    return path.normalize(candidatePath);
  }
  if (
    moduleSpecifier.startsWith("./") ||
    moduleSpecifier.startsWith("../")
  ) {
    return path.resolve(path.dirname(fromFile), moduleSpecifier);
  }
  return null;
}

function resolveModulePath(fromFile, moduleSpecifier) {
  const basePath = resolveModuleBasePath(fromFile, moduleSpecifier);
  if (!basePath) {
    return null;
  }

  const candidateFiles = new Set();

  const baseCandidate = basePath;
  candidateFiles.add(baseCandidate);

  moduleFileExtensions.forEach((ext) => {
    candidateFiles.add(basePath + ext);
  });

  for (const candidate of candidateFiles) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  if (fs.existsSync(basePath) && fs.statSync(basePath).isDirectory()) {
    for (const indexName of indexFileNames) {
      const candidate = path.join(basePath, indexName);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }

  return null;
}

function toModuleSpecifier(fromFile, targetFile) {
  const fromDir = path.dirname(fromFile);

  const aliasSpecifier = (() => {
    const absoluteTarget = path.normalize(path.resolve(targetFile));
    for (const mapping of aliasMappings) {
      if (
        absoluteTarget === mapping.pathPrefix ||
        absoluteTarget.startsWith(mapping.pathPrefixWithSep)
      ) {
        const remainder = absoluteTarget.slice(mapping.pathPrefix.length);
        let cleanedRemainder = remainder.replace(/^[\\/]/, "");
        let spec = mapping.hasWildcard
          ? mapping.aliasPrefix + cleanedRemainder.replace(/\\/g, "/")
          : mapping.aliasPrefix;
        spec = stripExtension(spec);
        return spec.replace(/\/+$/, "");
      }
    }
    return null;
  })();

  if (aliasSpecifier) {
    return aliasSpecifier;
  }

  const relativePath = path.relative(fromDir, targetFile);
  let withoutExt = stripExtension(relativePath);
  withoutExt = withoutExt.replace(/\\/g, "/");
  if (!withoutExt.startsWith(".")) {
    withoutExt = "./" + withoutExt;
  }
  return withoutExt;
}

function stripExtension(importPath) {
  for (const ext of moduleFileExtensions) {
    if (importPath.endsWith(ext)) {
      return importPath.slice(0, -ext.length);
    }
  }
  return importPath;
}

function chooseExportInfo(exportName, desiredKind, preferredBasePath) {
  const entries = exportIndex.get(exportName);
  if (!entries || entries.length === 0) {
    return null;
  }

  let candidates = entries;

  if (desiredKind === "type") {
    const typeCandidates = entries.filter((entry) => entry.kind === "type");
    if (typeCandidates.length > 0) {
      candidates = typeCandidates;
    }
  } else {
    const valueCandidates = entries.filter((entry) => entry.kind === "value");
    if (valueCandidates.length > 0) {
      candidates = valueCandidates;
    }
  }

  if (preferredBasePath) {
    const normalizedPreferred = path
      .resolve(preferredBasePath)
      .toLowerCase();
    const preferredCandidates = candidates.filter((entry) =>
      path.resolve(entry.filePath).toLowerCase().startsWith(normalizedPreferred)
    );
    if (preferredCandidates.length > 0) {
      candidates = preferredCandidates;
    }
  }

  if (candidates.length > 1) {
    candidates = [...candidates].sort((a, b) =>
      a.filePath.length - b.filePath.length
    );
  }

  return candidates[0];
}

function listModuleFilesRecursive(dirPath) {
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (isIgnoredDir(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listModuleFilesRecursive(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (moduleFileExtensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results.sort((a, b) => a.localeCompare(b));
}

function createNamedImportSpec(imported, local) {
  return imported === local ? imported : `${imported} as ${local}`;
}

function buildImportStatements(groups) {
  const statements = [];
  for (const group of groups.values()) {
    const { modulePath } = group;
    const namedValues = [...group.namedValues].sort((a, b) =>
      a.localeCompare(b)
    );
    const namedTypes = [...group.namedTypes].sort((a, b) =>
      a.localeCompare(b)
    );

    if (group.defaultValue) {
      if (namedValues.length > 0) {
        statements.push(
          `import ${group.defaultValue}, { ${namedValues.join(
            ", "
          )} } from '${modulePath}';`
        );
      } else {
        statements.push(`import ${group.defaultValue} from '${modulePath}';`);
      }
    } else if (namedValues.length > 0) {
      statements.push(
        `import { ${namedValues.join(", ")} } from '${modulePath}';`
      );
    }

    if (group.defaultType) {
      statements.push(`import type ${group.defaultType} from '${modulePath}';`);
    }

    if (namedTypes.length > 0) {
      statements.push(
        `import type { ${namedTypes.join(", ")} } from '${modulePath}';`
      );
    }
  }
  return statements;
}

function processImportDeclaration(filePath, sourceFile, node) {
  const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).slice(1, -1);
  const resolved = resolveModulePath(filePath, moduleSpecifier);
  if (resolved) {
    return null;
  }

  const importClause = node.importClause;
  if (!importClause) {
    return null;
  }

  const preferredBase = resolveModuleBasePath(filePath, moduleSpecifier);
  if (!preferredBase) {
    return null;
  }

  const groups = new Map();

  const addToGroup = (targetFile, type, imported, local) => {
    const modulePath = toModuleSpecifier(filePath, targetFile);
    if (!groups.has(modulePath)) {
      groups.set(modulePath, {
        modulePath,
        defaultValue: null,
        defaultType: null,
        namedValues: [],
        namedTypes: [],
      });
    }
    const group = groups.get(modulePath);
    if (type === "defaultValue") {
      group.defaultValue = local;
    } else if (type === "defaultType") {
      group.defaultType = local;
    } else if (type === "namedValue") {
      const spec = createNamedImportSpec(imported, local);
      if (!group.namedValues.includes(spec)) {
        group.namedValues.push(spec);
      }
    } else if (type === "namedType") {
      const spec = createNamedImportSpec(imported, local);
      if (!group.namedTypes.includes(spec)) {
        group.namedTypes.push(spec);
      }
    }
  };

  if (importClause.name) {
    const localName = importClause.name.text;
    const desiredKind = importClause.isTypeOnly ? "type" : "value";
    const exportInfo = chooseExportInfo("default", desiredKind, preferredBase);
    if (!exportInfo) {
      console.warn(
        `[fix-imports] Unable to resolve default import '${localName}' in ${filePath}`
      );
      return null;
    }
    if (desiredKind === "type") {
      addToGroup(exportInfo.filePath, "defaultType", exportInfo.importName, localName);
    } else {
      const actualImportName =
        exportInfo.importName || (desiredKind === "type" ? localName : "default");
      if (actualImportName === "default") {
        addToGroup(exportInfo.filePath, "defaultValue", actualImportName, localName);
      } else {
        addToGroup(exportInfo.filePath, "namedValue", actualImportName, localName);
      }
    }
  }

  if (importClause.namedBindings) {
    if (ts.isNamespaceImport(importClause.namedBindings)) {
      console.warn(
        `[fix-imports] Namespace import is not supported for automatic fix in ${filePath}`
      );
      return null;
    }

    if (ts.isNamedImports(importClause.namedBindings)) {
      for (const element of importClause.namedBindings.elements) {
        const localName = element.name.text;

        const exportName = element.propertyName
          ? element.propertyName.text
          : element.name.text;

        const desiredKind = element.isTypeOnly ? "type" : "value";

        const exportInfo = chooseExportInfo(
          exportName,
          desiredKind,
          preferredBase
        );

        if (!exportInfo) {
          console.warn(
            `[fix-imports] Unable to resolve named import '${exportName}' in ${filePath}`
          );
          return null;
        }

        if (desiredKind === "type" && exportInfo.importName === "default") {
          addToGroup(
            exportInfo.filePath,
            "defaultType",
            exportInfo.importName,
            localName
          );
        } else if (desiredKind === "type") {
          addToGroup(
            exportInfo.filePath,
            "namedType",
            exportInfo.importName,
            localName
          );
        } else if (exportInfo.importName === "default") {
          addToGroup(
            exportInfo.filePath,
            "defaultValue",
            exportInfo.importName,
            localName
          );
        } else {
          addToGroup(
            exportInfo.filePath,
            "namedValue",
            exportInfo.importName,
            localName
          );
        }
      }
    }
  }

  if (groups.size === 0) {
    return null;
  }

  const statements = buildImportStatements(groups);
  const replacement = statements.join("\n") + "\n";
  return {
    start: node.getStart(sourceFile),
    end: node.getEnd(),
    text: replacement,
  };
}

function processExportDeclaration(filePath, sourceFile, node) {
  if (!node.moduleSpecifier) {
    return null;
  }
  const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).slice(1, -1);
  const resolved = resolveModulePath(filePath, moduleSpecifier);
  if (resolved) {
    return null;
  }

  const basePath = resolveModuleBasePath(filePath, moduleSpecifier);
  if (!basePath) {
    return null;
  }

  if (!fs.existsSync(basePath) || !fs.statSync(basePath).isDirectory()) {
    return null;
  }

  const moduleFiles = listModuleFilesRecursive(basePath);
  if (moduleFiles.length === 0) {
    return null;
  }

  const statements = moduleFiles.map((file) => {
    const spec = toModuleSpecifier(filePath, file);
    return `export * from '${spec}';`;
  });

  const replacement = statements.join("\n") + "\n";
  return {
    start: node.getStart(sourceFile),
    end: node.getEnd(),
    text: replacement,
  };
}

function processFile(filePath) {
  if (processedFiles.has(filePath)) {
    return;
  }
  processedFiles.add(filePath);

  const ext = path.extname(filePath);
  if (!moduleFileExtensions.includes(ext)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const scriptKind = ext === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );

  const modifications = [];

  sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      const mod = processImportDeclaration(filePath, sourceFile, node);
      if (mod) {
        modifications.push(mod);
      }
    } else if (ts.isExportDeclaration(node)) {
      const mod = processExportDeclaration(filePath, sourceFile, node);
      if (mod) {
        modifications.push(mod);
      }
    }
  });

  if (modifications.length === 0) {
    return;
  }

  modifications.sort((a, b) => b.start - a.start);
  let updated = content;
  for (const mod of modifications) {
    updated = updated.slice(0, mod.start) + mod.text + updated.slice(mod.end);
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    modifiedFiles.add(filePath);
  }
}

function walkFiles(dirPath, handler) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (isIgnoredDir(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, handler);
    } else if (entry.isFile()) {
      handler(fullPath);
    }
  }
}

function run() {
  walkAndCollectExports(libDir);

  walkFiles(appDir, (file) => {
    processFile(file);
  });

  if (modifiedFiles.size > 0) {
    console.log(
      `[fix-imports] Updated ${modifiedFiles.size} files with explicit imports.`
    );
  } else {
    console.log("[fix-imports] No changes were necessary.");
  }
}

run();
