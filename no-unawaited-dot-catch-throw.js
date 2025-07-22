
/**
 * @fileoverview Tests for no throw in unawaited .catch() block
 * @author Reece Daniels <github.com/rubengmurray>
 */

'use strict';

module.exports = {
  meta: {
    type: "problem",
    docs: {
        description: "Enforce that an unawaited promise with a catch does not contain a throw",
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
          (
            node.parent.type !== 'AwaitExpression' && 
            node.parent.type !== 'ReturnStatement' 
            && node.parent.type !== 'ArrowFunctionExpression'
          )
          ) {
            // ✅ If the promise is assigned to a variable, skip the check, as it is likely to be awaited later.
            let current = node.parent;
            while (current && current.type !== 'Program') {
              if (current.type === 'VariableDeclarator') {
                // Assigned to const/let/var — potentially awaited later
                return;
              }
              current = current.parent;
            }

            const unnecessaryThrowNode = node?.arguments?.[0]?.body?.body?.find(b => b.type === 'ThrowStatement');

            if (!unnecessaryThrowNode) {
              return;
            }

            /*
            * Report error to ESLint.
            */
            context.report({
              node,
              message: 'Throw is unnecessary in an unawaited catch block',
              data: {
                  notBar: 'the_val' // Not sure what this does, but rule currently works
              },
              fix: function(fixer) {
                // Replace the ThrowStatement's range with an empty string
                return fixer.replaceTextRange(
                  [unnecessaryThrowNode.range[0], unnecessaryThrowNode.range[1] + 1],
                  ''
                );
              }
            });
        }
      }
    };
}
};
