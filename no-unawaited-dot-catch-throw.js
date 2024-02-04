
/**
 * @fileoverview Tests for no throw in unawaited .catch() block
 * @author Reece Daniels <github.com/rubengmurray>
 */

'use strict';

module.exports = {
  meta: {
    type: "problem",
    docs: {
        description: "Enforce that a unawaited promise with a catch does not contain a throw",
    },
    fixable: "code",
    schema: []
},
create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' && 
          node.callee.property.name === 'catch' && 
          node.parent.type !== 'AwaitExpression'
          ) {
          if (node?.arguments?.[0]?.body?.body?.find(b => b.type === 'ThrowStatement')) {
            /*
            * Report error to ESLint.
            */
            context.report({
              node,
              message: 'Throw is unnecessary in an unawaited catch block',
              data: {
                  notBar: 'the_val'
              },
            });
          }
        }
      }
    };
}
};