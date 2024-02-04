
// TODO: add npm patch to release process

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
            const unnecessaryThrowNode = node?.arguments?.[0]?.body?.body?.find(b => b.type === 'ThrowStatement');

            if (!unnecessaryThrowNode) {
              return;
            }
  
            // console.log(node, 'node')
            // if (node?.arguments?.[0]?.body?.body?.find(b => b.type === 'ThrowStatement')) {
              /*
              * Report error to ESLint. Error message uses
              * a message placeholder to include the incorrect value
              * in the error message.
              * Also includes a `fix(fixer)` function that replaces
              * any values assigned to `const foo` with "bar".
              */
              context.report({
                node,
                message: 'Throw is unnecessary in an unawaited catch block',
                data: {
                    notBar: 'the_val'
                },
                fix: function(fixer) {
                  // Replace the ThrowStatement's range with an empty string
                  return fixer.replaceText(unnecessaryThrowNode, '');
              }
              });
            // }
        }
      }
    };
}
};