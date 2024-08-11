import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = "your api key";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// function convertToLineBreaks(input) {
//     // Use regular expression to match each item
//     const regex = /(\d+\)\s[^(\d+\))]+)/g;
//     let matches = input.match(regex);
  
//     // Join the matched items with '\n'
//     let result = matches ? matches.join('<br>') : input;
    
//     return result;
//   }

function gen_prompt(budget, type, fuel, brand, engineSize, power, mileage, occasion, description) {
    var prompt = `Give vehicle buying recommendations in india based on the following preferences note that: (budget is given in INR and is onroad i.e including taxes and all and it has not to be of exact price , it can varry a bit in case of taxs  and miselenous but it should start form the given budget) ,give more preference to keeping it in budget \n Budget in Rupees : $${budget}, 
            Vehicle Type: ${type}, 
            Fuel Type: ${fuel}`
        ;
    if (brand) {
        prompt = prompt + ",\nBrand :" + brand;
    }
    if (power) {
        prompt = prompt + ",\npower :" + power + "hp (flexible + or -20 hp )";
    }
    if (engineSize) {
        prompt = prompt + ",\nEngineSize:" + engineSize + "cc  (flexible + or -100 cc )";
    }
    if (mileage) {
        prompt = prompt + ",\nMilage: " + mileage + "kmpl (+ or - 5kmpl)";
    }
    if (occasion) {
        prompt = prompt + ",\n it should be suitable for : " + occasion;
    }
    if (description !=' ') {
        prompt = prompt + "and having addition description :" + description;
    }
    prompt = prompt + "\nProvide a list with 'just' of name of vehicles that match these criteria.";

    prompt=prompt+"the output should meet the following pattern with proper line breaks: \n 1)name1 -sedan milage: ,cc: , hp:  \n 2)name2 -suv milage: ,cc: , hp: endline\n and donot provide any *** ,Give NOT FOund if unavailable";
    return prompt;

}
async function run(budget, type, fuel, brand, engineSize, power, mileage, occasion, description) {
    console.log(budget, type, fuel, brand, engineSize, power, mileage, occasion, description)
    prompt=gen_prompt(budget, type, fuel, brand, engineSize, power, mileage, occasion, description);
    const result = await model.generateContent(prompt);
    const response = await result.response; 
    const text = await response.text();
    console.log(text)
    
    document.getElementById('response').innerHTML = text.replace(/\n/g,'<br>');

}

document.getElementById('vehicle-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    document.getElementById('thinking-text').innerText = "Wait while we fetch the best recommendations...";
    document.querySelector('button[type="submit"]').style.display="none";
   
    const x=document.querySelector('.loading_1');
    x.style.display="block";
    
    const budget = document.getElementById("inputBudget").value;
    const type = document.getElementById("inputType").value;
    const fuel = document.getElementById("inputFuel").value;
    const brand = document.getElementById("inputBrand").value;
    const engineSize = document.getElementById("inputEngineSize").value;
    const power = document.getElementById("inputPower").value;
    const mileage = document.getElementById("inputMileage").value;
    const occasion = document.getElementById("inputOccasion").value;
    const description = document.getElementById("inputDescription").value;
    await run(budget, type, fuel, brand, engineSize, power, mileage, occasion, description);
    x.style.display="none";
    document.querySelector('button[type="submit"]').style.display="flex";

});
