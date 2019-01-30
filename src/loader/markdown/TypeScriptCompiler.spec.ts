
import * as should from 'should';

import TypeScriptCompiler from './TypeScriptCompiler';

const MODULE_HEADER = '"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\n';

describe('markdown/TypeScriptCompiler', () => {
  let testedCompiler : TypeScriptCompiler;

  beforeEach(() => {
    testedCompiler = new TypeScriptCompiler();
  });

  it('throws Error when compiling code with syntax error', () => {
    should(() => testedCompiler.compile('>', 'test.ts'))
      .throw('test.ts (1,1): Expression expected.\ntest.ts (1,2): Expression expected.')
    ;
  });

  it('transpiles valid typescript', () => {
    const compiled = testedCompiler.compile('export const a : string = "b";', 'test.ts');
    compiled.should.equal(`${MODULE_HEADER}exports.a = "b";\n`);
  });
});
