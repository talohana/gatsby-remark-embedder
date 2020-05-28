import cases from 'jest-in-case';

import plugin from '../../';
import { getHTML, shouldTransform } from '../../transformers/TestingPlayground';

import { cache, getMarkdownASTForFile, parseASTToMarkdown } from '../helpers';

cases(
  'url validation',
  ({ url, valid }) => {
    expect(shouldTransform(url)).toBe(valid);
  },
  {
    'non-Testing Playground url': {
      url: 'https://not-a-testing-playground-url.com',
      valid: false,
    },
    "non-Testing Playground url ending with 'testing-playground.com'": {
      url: 'https://this-is-not-testing-playground.com',
      valid: false,
    },
    "non-Testing Playground url ending with 'testing-playground.com' having 'markup' searchParam": {
      url: 'https://this-is-not-testing-playground.com?markup=foobar',
      valid: false,
    },
    "non-Testing Playground url ending with 'testing-playground.com' and having '/embed/'": {
      url: 'https://this-is-not-testing-playground.com/embed?markup=foobar',
      valid: false,
    },
    'dnt policy page': {
      url: 'https://testing-playground.com/.well-known/dnt-policy.txt',
      valid: false,
    },
    'Playground url': {
      url: 'https://testing-playground.com?markup=foobar',
      valid: true,
    },
    "Playground url having 'www' subdomain": {
      url: 'https://www.testing-playground.com?markup=foobar',
      valid: true,
    },
  }
);

test('Gets the correct Testing Playground iframe', () => {
  const html = getHTML('https://testing-playground.com/?markup=foobar');

  expect(html).toMatchInlineSnapshot(
    `"<iframe src=\\"https://testing-playground.com/?markup=foobar\\" width=\\"100%\\" height=\\"300\\" scrolling=\\"no\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allowfullscreen=\\"true\\" style=\\"overflow: hidden; display: block;\\" loading=\\"lazy\\"></iframe>"`
  );
});

test('Plugin can transform Testing Playground links', async () => {
  const markdownAST = getMarkdownASTForFile('TestingPlayground');

  const processedAST = await plugin({ cache, markdownAST });

  expect(parseASTToMarkdown(processedAST)).toMatchInlineSnapshot(`
    "<https://not-a-testing-playground-url.com>

    <https://this-is-not-testing-playground.com>

    <https://this-is-not-testing-playground.com?markup=foobar>

    <https://this-is-not-testing-playground.com/embed?markup=foobar>

    <https://testing-playground.com/.well-known/dnt-policy.txt>

    <iframe src=\\"https://testing-playground.com/?markup=foobar\\" width=\\"100%\\" height=\\"300\\" scrolling=\\"no\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allowfullscreen=\\"true\\" style=\\"overflow: hidden; display: block;\\" loading=\\"lazy\\"></iframe>

    <iframe src=\\"https://www.testing-playground.com/?markup=foobar\\" width=\\"100%\\" height=\\"300\\" scrolling=\\"no\\" frameborder=\\"0\\" allowtransparency=\\"true\\" allowfullscreen=\\"true\\" style=\\"overflow: hidden; display: block;\\" loading=\\"lazy\\"></iframe>
    "
  `);
});
