import jokes from "./assets/jokes.json";
import quotes from "./assets/quotes.json";
import random from "./assets/random.json";

import { saveTestResult, getTestsResults } from "./src/database";
import { askUser, compareTexts, getRandomItem } from "./src/utils";

type MenuOption = {
    name: string;
    action: () => void;
};

const options: MenuOption[] = [
    {
        name: "random typing test",
        action: () => {
            const text = getRandomItem(random);
            runTypingTest(text);
        },
    },
    {
        name: "quote typing test",
        action: () => {
            const text = getRandomItem(quotes);
            runTypingTest(text);
        },
    },
    {
        name: "joke typing test",
        action: () => {
            const text = getRandomItem(jokes);
            runTypingTest(text);
        },
    },
    {
        name: "custom typing test",
        action: () => {
            let input = prompt("enter your custom text:");

            while (!input || !input.trim()) {
                console.log("cant be empty");
                input = prompt("enter your custom text:");
            }

            runTypingTest(input.trim());
        },
    },
    {
        name: "list previous tests results",
        action() {
            console.clear();
            const results = getTestsResults();

            if (!results.length) {
                console.log("no results to show");
            }

            for (const result of results) {
                console.log("|-------------------------------------|");
                console.log(`|   Date (UTC): ${result.date}   |`);
                console.log(`|   Accuracy: ${result.accuracy}%`.padEnd(37), "|");
                console.log(`|   Time: ${result.time}s`.padEnd(37), "|");
                console.log("|-------------------------------------|");
            }

            prompt("press enter to go back to the menu");
            console.clear();
            showMainMenu();
        }
    }
];

function showMainMenu(): void {
    for(const [index, option] of options.entries()) {
        console.log(`${index + 1}. ${option.name}`);
    }
    console.log("q. quit\n");

    const choice = askUser("> ");

    if (choice.toLowerCase() === "q") {
        console.clear();
        process.exit(0);
    }

    const index = Number(choice) - 1;
    if (Number.isNaN(index) || index < 0 || index >= options.length || !options[index]) {
        console.clear();
        console.log("\ninvalid option, choose from the menu");
        showMainMenu();
        return;
    }

    options[index].action();
}

function runTypingTest(text: string): void {
    console.log(text);

    const startTime = new Date();
    const userTyped = askUser("");
    const endTime = new Date();
    const result = compareTexts(text, userTyped);

    console.clear();
    console.log(`\naccuracy: ${result.accuracy.toFixed(2)}%`);
    console.log(`time: ${(endTime.getTime() - startTime.getTime()) / 1000}s`);
    console.log("---- diff ----");
    console.log(text);
    console.log(result.diffOutput);
    saveTestResult(new Date(), (endTime.getTime() - startTime.getTime()) / 1000, Number(result.accuracy.toFixed(2)));
    console.log("result saved");

    const nextAction = askUser("\ntype 'r' to restart, anything else to quit: ");
    if (nextAction.toLowerCase() === "r") {
        console.clear();
        showMainMenu();
    } else {
        console.clear();
        process.exit(0);
    } 
}

showMainMenu();

