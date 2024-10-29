CodeMirror.defineMode("minecraftProperties", function() {
    return {
        startState: function() {
            return { inComment: false };
        },
        token: function(stream, state) {
            // Comment line
            if (stream.sol() && stream.match("#")) {
                stream.skipToEnd();
                return "comment";
            }

            // Key (before `=` symbol)
            if (stream.match(/^[a-zA-Z0-9._-]+(?==)/)) {
                return "property";
            }

            // Separator (the `=` symbol)
            if (stream.match("=")) {
                return "operator";
            }

            // Numeric values (e.g., integers like 20, 256)
            if (stream.match(/^\d+/)) {
                return "number"; // Custom style for numbers
            }

            // String values (anything else until end of line or comment)
            if (stream.match(/[^#\n]*/)) {
                return "string";
            }

            // Skip unhandled characters
            stream.next();
            return null;
        }
    };
});

CodeMirror.defineMIME("text/x-minecraft-properties", "minecraftProperties");