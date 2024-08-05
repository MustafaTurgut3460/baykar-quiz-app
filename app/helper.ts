import { PostType } from "./types";

export const getData = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (res.ok) {
    return await res.json();
  }

  return [];
};

export const prepareQuestions = (posts: PostType[]) => {
  const questions = posts.map((post) => {
    const options = generateRandomOptions(post.body);
    return {
      id: post.id,
      question: post.title,
      options: options,
    };
  });

  return questions;
};

function generateRandomOptions(text: string) {
  const words = text.split(" ");
  const options: string[] = [];

  while (options.length < 4) {
    // 2 ila 4 kelime uzunluğunda rastgele bir seçenek oluştur
    const randomLength = Math.floor(Math.random() * 3) + 2;
    const randomStartIndex = Math.floor(
      Math.random() * (words.length - randomLength)
    );
    const randomOption = words
      .slice(randomStartIndex, randomStartIndex + randomLength)
      .join(" ");

    if (!options.includes(randomOption) && randomOption.length > 1) {
      options.push(randomOption);
    }
  }

  return options;
}
