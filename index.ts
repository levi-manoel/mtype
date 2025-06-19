import jokes from "./assets/jokes.json";
import quotes from "./assets/quotes.json";
import random from "./assets/random.json";

type TypingMode = {
    name: string;
    getText: () => string;
};

const FALLBACK_TEXT = "ai papai";
const modes: TypingMode[] = [
    {
        name: "random typing test",
        getText: () => getRandomItem(random),
    },
    {
        name: "quote typing test",
        getText: () => getRandomItem(quotes),
    },
    {
        name: "joke typing test",
        getText: () => getRandomItem(jokes),
    },
    {
        name: "custom typing test",
        getText: () => {
            let input = prompt("enter your custom text:");
            while (!input || !input.trim()) {
                console.log("cant be empty");
                input = prompt("enter your custom text:");
            }
            return input.trim();
        },
    },
];

function getRandomItem(arr: string[]): string {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index] ?? FALLBACK_TEXT;
}

function askUser(message: string): string {
    const input = prompt(message);
    if (input === null) process.exit(0);
    return input.trim();
}

function showMainMenu(): void {
    for(const [index, mode] of modes.entries()) {
        console.log(`${index + 1}. ${mode.name}`);
    }
    console.log("q. quit\n");

    const choice = askUser("> ");

    if (choice.toLowerCase() === "q") {
        console.clear();
        process.exit(0);
    }

    const index = Number(choice) - 1;
    if (Number.isNaN(index) || index < 0 || index >= modes.length) {
        console.log("\ninvalid option, choose from the menu");
        console.clear();
        showMainMenu();
        return;
    }

    const textToType = modes[index]?.getText() ?? FALLBACK_TEXT;
    runTypingTest(textToType);
}

function runTypingTest(text: string): void {
    console.log(text);

    const userTyped = askUser("");
    const result = compareTexts(text, userTyped);

    console.log(`\naccuracy: ${result.accuracy.toFixed(2)}%`);
    console.log(text);
    console.log(result.diffOutput);

    const nextAction = askUser("\ntype 'r' to restart, anything else to quit: ");
    if (nextAction.toLowerCase() === "r") {
        console.clear();
        showMainMenu();
    } else {
        console.clear();
        process.exit(0);
    } 
}

type TypingResult = {
    accuracy: number;
    diffOutput: string;
};

function compareTexts(expected: string, typed: string): TypingResult {
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

showMainMenu();

