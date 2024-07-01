function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export function getRandomValues(arr: string[]) {
  if (arr.length < 3) {
    throw new Error("Array must have at least 3 elements");
  }

  // Shuffle the array
  const shuffledArray = shuffleArray([...arr]); // Use a copy of the array to avoid mutating the original
  // Return the first three elements of the shuffled array
  return shuffledArray.slice(0, 3);
}
