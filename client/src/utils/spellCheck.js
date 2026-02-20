// Basic English word dictionary (expanded with common words)
const dictionary = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just',
  'let', 'like',
  'make', 'may', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'us',
  'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves',
  // Common nouns and verbs
  'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work', 'week', 'case', 'point', 'government', 'company',
  'number', 'group', 'problem', 'fact', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able',
  'get', 'make', 'go', 'know', 'take', 'see', 'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'keep', 'let', 'begin', 'help', 'talk', 'turn', 'start', 'show', 'hear', 'play', 'run', 'move', 'live', 'believe', 'hold', 'bring', 'happen', 'write', 'provide', 'sit', 'stand', 'lose', 'pay', 'meet', 'include', 'continue', 'set', 'learn', 'change', 'lead', 'understand', 'watch', 'follow', 'stop', 'create', 'speak', 'read', 'allow', 'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember', 'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die', 'send', 'expect', 'build', 'stay', 'fall', 'cut', 'reach', 'kill', 'remain',
  // Presentation-related words
  'slide', 'slides', 'presentation', 'content', 'title', 'text', 'image', 'chart', 'table', 'design', 'layout', 'template', 'background', 'color', 'font', 'size', 'style', 'format', 'edit', 'insert', 'delete', 'copy', 'paste', 'save', 'export', 'import', 'print', 'share', 'view', 'zoom', 'transition', 'animation', 'effect', 'theme', 'bullet', 'list', 'paragraph', 'align', 'bold', 'italic', 'underline'
]);

// Common misspellings and their corrections
const commonCorrections = {
  'teh': 'the',
  'adn': 'and',
  'recieve': 'receive',
  'seperate': 'separate',
  'occured': 'occurred',
  'definately': 'definitely',
  'accomodate': 'accommodate',
  'acheive': 'achieve',
  'beleive': 'believe',
  'calender': 'calendar',
  'concious': 'conscious',
  'enviroment': 'environment',
  'existance': 'existence',
  'goverment': 'government',
  'independant': 'independent',
  'occassion': 'occasion',
  'reccomend': 'recommend',
  'untill': 'until',
  'wierd': 'weird'
};

// Function to check if a word is in the dictionary
export const isWordInDictionary = (word) => {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  return dictionary.has(cleanWord);
};

// Function to get spelling suggestions for a word
export const getSpellingSuggestions = (word) => {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');

  // Check if it's a common misspelling
  if (commonCorrections[cleanWord]) {
    return [commonCorrections[cleanWord]];
  }

  // Simple suggestion algorithm: words that differ by one character
  const suggestions = [];
  for (const dictWord of dictionary) {
    if (Math.abs(dictWord.length - cleanWord.length) <= 1) {
      let diffCount = 0;
      const maxLen = Math.max(dictWord.length, cleanWord.length);
      for (let i = 0; i < maxLen; i++) {
        if (dictWord[i] !== cleanWord[i]) {
          diffCount++;
          if (diffCount > 1) break;
        }
      }
      if (diffCount <= 1) {
        suggestions.push(dictWord);
      }
    }
  }

  return suggestions.slice(0, 5); // Return up to 5 suggestions
};

// Use browser's built-in spell checker
export const checkSpelling = (text) => {
  // Extract words from text
  const words = text.match(/\b[a-zA-Z]+\b/g) || [];
  const misspelledWords = [];
  const seen = new Set();

  words.forEach((word, index) => {
    const lowerWord = word.toLowerCase();
    // Skip if already checked
    if (seen.has(lowerWord)) return;
    seen.add(lowerWord);

    // Check if word is likely misspelled (very basic heuristic)
    // Words shorter than 2 characters are usually fine
    if (word.length < 2) return;

    // Check against dictionary
    if (!isWordInDictionary(lowerWord)) {
      const suggestions = getSpellingSuggestions(lowerWord);
      misspelledWords.push({
        word: word,
        position: index,
        suggestions: suggestions.length > 0 ? suggestions : [word]
      });
    }
  });

  return misspelledWords;
};