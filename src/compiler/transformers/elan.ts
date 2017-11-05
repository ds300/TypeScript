/// <reference path="../factory.ts" />
/// <reference path="../visitor.ts" />
/// <reference path="./esnext.ts" />

namespace ts {
  export function transformElan(context: TransformationContext) {
    // const compilerOptions = context.getCompilerOptions();

    return transformSourceFile;

    /**
     * Transform elan-specific syntax in a SourceFile.
     *
     * @param node A SourceFile node.
     */
    function transformSourceFile(node: SourceFile) {
      if (node.isDeclarationFile) {
        return node;
      }

      const visited = visitEachChild(node, visitor, context);
      addEmitHelpers(visited, context.readEmitHelpers());
      return visited;
    }

    function visitor(node: Node): VisitResult<Node> {
      if (node.transformFlags & TransformFlags.ContainsElan) {
        return visitorWorker(node);
      } else {
        return node;
      }
    }

    function visitorWorker(node: Node): VisitResult<Node> {
      switch (node.kind) {
        case SyntaxKind.ElanStateDeclaration:
          return visitElanStateDeclaration(node as ElanStateDeclaration);

        default:
          return visitEachChild(node, visitor, context);
      }
    }

    function visitElanStateDeclaration(node: ElanStateDeclaration) {
      const declarations = createVariableDeclarationList([
        createVariableDeclaration(
          idText(node.name),
          undefined,
          createObjectLiteral()
        )
      ]);
      declarations.flags |= NodeFlags.Const;
      return createVariableStatement(
        [<Modifier>createNode(SyntaxKind.ExportKeyword)],
        declarations
      );
    }
  }
}
