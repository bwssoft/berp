export function generateRandomPassword(length: number = 12): string {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%*()_=+/{ }^~?"`:;.,<>';
  
    const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars;
  
    if (length < 8) length = 8;
    if (length > 32) length = 32;
  
    let passwordArray = [
      upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)],
      lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];
  
    for (let i = passwordArray.length; i < length; i++) {
      passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
  
    // Embaralhar caracteres
    passwordArray = passwordArray.sort(() => Math.random() - 0.5);
  
    return passwordArray.join('');
  }