import { cwd } from 'node:process';
import { resolve } from 'node:path';
import parse from '../src/parse.js';
import genDiff from '../src/index.js';

const jsonAbsoluteFilepath1 = resolve(cwd(), '__fixtures__/file1.json');
const jsonAbsoluteFilepath2 = resolve(cwd(), '__fixtures__/file2.json');

const ymlAbsoluteFilepath1 = resolve(cwd(), '__fixtures__/file1.yml');
const ymlAbsoluteFilepath2 = resolve(cwd(), '__fixtures__/file2.yml');

const jsonFilepath1 = '__fixtures__/file1.json';
const jsonFilepath2 = '__fixtures__/file2.json';

const ymlFilepath1 = '__fixtures__/file1.yml';
const ymlFilepath2 = '__fixtures__/file2.yml';

const expectedOutputStylish = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

const expectedOutputPlain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

const expectedOutputJSON = `{
  "key": "common",
  "value": {
    "key": "follow",
    "status": "added",
    "value": false
  },
  {
    "key": "setting1",
    "status": "unchanged",
    "value": "Value 1"
  },
  {
    "key": "setting2",
    "status": "removed",
    "value": 200
  },
  {
    "key": "setting3",
    "status": "changed",
    "oldValue": true,
    "newValue": null
  },
  {
    "key": "setting4",
    "status": "added",
    "value": "blah blah"
  },
  {
    "key": "setting5",
    "status": "added",
    "value": {
      "key": "key5",
      "value": "value5"
    }
  },
  {
    "key": "setting6",
    "value": {
      "key": "doge",
      "value": {
        "key": "wow",
        "status": "changed",
        "oldValue": "",
        "newValue": "so much"
      }
    },
    {
      "key": "key",
      "status": "unchanged",
      "value": "value"
    },
    {
      "key": "ops",
      "status": "added",
      "value": "vops"
    }
  }
},
{
  "key": "group1",
  "value": {
    "key": "baz",
    "status": "changed",
    "oldValue": "bas",
    "newValue": "bars"
  },
  {
    "key": "foo",
    "status": "unchanged",
    "value": "bar"
  },
  {
    "key": "nest",
    "status": "changed",
    "oldValue": {
      "key": "key",
      "value": "value"
    },
    "newValue": "str"
  }
},
{
  "key": "group2",
  "status": "removed",
  "value": {
    "key": "abc",
    "value": 12345
  },
  {
    "key": "deep",
    "value": {
      "key": "id",
      "value": 45
    }
  }
},
{
  "key": "group3",
  "status": "added",
  "value": {
    "key": "deep",
    "value": {
      "key": "id",
      "value": {
        "key": "number",
        "value": 45
      }
    }
  },
  {
    "key": "fee",
    "value": 100500
  }
}`;

test('parse', () => {
  expect(() => {
    parse('');
  }).toThrow();
});

test('genDiff stylish', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'stylish')).toBe(expectedOutputStylish);
  expect(genDiff(jsonAbsoluteFilepath1, jsonAbsoluteFilepath2, 'stylish')).toBe(expectedOutputStylish, 'stylish');
  expect(genDiff(ymlFilepath1, ymlFilepath2, 'stylish')).toBe(expectedOutputStylish, 'stylish');
  expect(genDiff(ymlAbsoluteFilepath1, ymlAbsoluteFilepath2, 'stylish')).toBe(expectedOutputStylish, 'stylish');
  expect(genDiff(jsonFilepath1, ymlFilepath2, 'stylish')).toBe(expectedOutputStylish, 'stylish');
});

test('genDiff plain', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'plain')).toBe(expectedOutputPlain);
});

test('genDiff json', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'json')).toBe(expectedOutputJSON);
});
