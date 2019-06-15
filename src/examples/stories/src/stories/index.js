import importAll from 'import-all.macro';

const loadStories = async () => {
  await importAll('./**/*.js');
}

loadStories();
