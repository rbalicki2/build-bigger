// @flow

const getArrayFromTerm = (searchTerm: string): $ReadOnlyArray<string> =>
  (searchTerm.length > 10
    ? []
    : [
      searchTerm,
      ...[
        `${searchTerm} the silly`,
        `${searchTerm} the great`,
        `${searchTerm} the ambivalent`,
        `${searchTerm}'s great adventure`,
        `${searchTerm} goes on a quest`,
        `${searchTerm}'s guide to the universe`,
        `${searchTerm} vs the world`,
        `${searchTerm}, exposed!`,
        `${searchTerm} cash`,
        `${searchTerm} and punishment`,
        `${searchTerm} Quixote`,
        `${searchTerm} and the Argonauts`,
        `${searchTerm} Panther`,
        `${searchTerm} America`,
        `${searchTerm} and Morty`,
        `${searchTerm}'s guide to the world`,
        `${searchTerm}, on photography`,
        `${searchTerm} went to the market`,
        `${searchTerm} returns`,
        `${searchTerm} meets Huckleberry Finn`,
        `${searchTerm} and the goblet of fire`,
        `${searchTerm} and the prisoners of vim`,
        `${searchTerm} and the half blood prince`,
        `${searchTerm} and Robin`,
        `${searchTerm} cometh`,
      ].filter(() => Math.random() > 0.8),
    ]
  );

const MAX_LENGTH = 3000;
export default (searchTerm: string): Promise<$ReadOnlyArray<string>> => {
  const delayTime = Math.random() * MAX_LENGTH;
  return new Promise((resolve) => {
    setTimeout(() => resolve(getArrayFromTerm(searchTerm)), delayTime);
  });
};
