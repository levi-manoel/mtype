export function getRandomItem(arr: string[]): string {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index] ?? "ai papai";
}

export function askUser(message: string): string {
    const input = prompt(message);
    if (input === null) process.exit(0);
    return input.trim();
}

export function compareTexts(expected: string, typed: string) {
    const expectedChars = expected.split("");
    const typedChars = typed.split("");

    let matches = 0;
    let diffParts: string[] = [];

    for (const [index, char] of expectedChars.entries()) {
        const typedChar = typedChars[index];

        if (typedChar === char) {
            matches += 1;
            diffParts.push(char === " " ? " " : `\x1b[32m${typedChar}\x1b[0m`);
        } else if (typedChar === undefined) {
            diffParts.push("\x1b[41m \x1b[0m");
        } else {
            diffParts.push(typedChar === " " ? `\x1b[41m \x1b[0m` : `\x1b[31m${typedChar}\x1b[0m`);
        }
    }

    const accuracy = (matches / expected.length) * 100;
    return { accuracy, diffOutput: diffParts.join("") };
}

