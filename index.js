/*
Websites work with data
    -blog posts, todos, comments, user info, scores etc

We can store this data in a database (so we can use them later on)
    -Firebase (by Google)

The database won't be stored in our computer, it is stored in a server

*/
//---------------------------------------------------------------------------------
// SQL databases vs NoSQL databases
/*
view TypesOfDatabases.png

(i) SQL Databases (works well with PHP)
-Tables
-Rows
-Columns

(ii) NoSQL Databases (works well with JS)
-Collections
-Documents
-Properties

Here is an example of a NoSQL database (view nosql.png):
Blogs (Collection) --> Documents  --> Document (like a JSON)
*/

//---------------------------------------------------------------------------------
/*

The first NoSQL database we're going to look at is Firestore (which is provided by Firebase service)
- Later on we will look at MongoDB

Firebase is known as Backend as a service (BAAS). --> Provides backend solution to our websites
- No need to worry about setting up a server, run server-side code, handle auth of users

(view firebase.png)

https://firebase.google.com/

sign up free account --> go to console --> add project --> dashboard

When you're in your dashboard, this is the control centre of the backend of your website

(view dashboard.png)
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
    getFirestore,
    collection,
    getDoc,
    getDocs,
    updateDoc,
    Timestamp,
    addDoc,
    doc,
    deleteDoc,
    onSnapshot,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqWNa1pTNxSjfLgbSzB7rD1-rxH5uY6DU",
    authDomain: "recipe-cc93e.firebaseapp.com",
    projectId: "recipe-cc93e",
    storageBucket: "recipe-cc93e.appspot.com",
    messagingSenderId: "933798219511",
    appId: "1:933798219511:web:0982da97c7ccf8e5de0df2"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

// get Dom references
const atStart = document.querySelector(".start")
const title = document.querySelector(".title")
const list = document.querySelector('.recipe-list')
const ingList = document.querySelector(".ingredient-list")
const form = document.querySelector('.recipe-form')
const ingForm = document.querySelector('.ingredients-form')
const textarea = document.querySelector("textarea")
const updateDescription = document.querySelector(".description-button")
const editDescriptionButton = document.querySelector(".edit-button")
const descriptionContent = document.querySelector(".description-content")
const recipes = document.querySelector(".recipe-box")
const descriptionContainer = document.querySelector(".description-container")
const ingredientsContainer = document.querySelector(".ingredients-container")
// ===========================================================
// UI Stuff 

const addRecipe = (recipe, id) => {
    

    // attach custom data attribute "data-id" to each <li>
    let html = `
        <li data-id="${id}" class="border-2 rounded-md flex justify-between p-2 mb-3 cursor-pointer">
            <div class="flex items-center">${recipe.title}</div>
            <img src="trash.svg" class="delete w-6 h-6">
        </li>
    `;

    list.innerHTML += html;
}

const deleteRecipe =(id)=>{
    const recipes = document.querySelectorAll("li");
    recipes.forEach(recipe=>{
        if(recipe.getAttribute("data-id") == id){
            recipe.remove()
        }
    })
}

const getDescription = (id) => {
    const recipes = document.querySelectorAll("li")
    recipes.forEach(recipe => {
        if (recipe.getAttribute("data-id") == id) {
            console.log(recipe.value)
        }
    })
}

const addIngredient = (ingredient) => {
    ingList.innerHTML += 
    `
    <li class="mb-4">
        <div class="flex items-center justify-between border-2 rounded-lg p-2 ">
            <textarea class="hidden edit-ingredient-box" name=""></textarea>
            <span class="current-ingredient">${ingredient}</span>
            <div class="flex flex-row items-center">
                <button type="submit" class="mr-1 block h-9 w-16 py-2 bg-pink-500 text-white text-sm rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:bg-blue-600 edit-ingredient">Edit</button>
                <button type="submit" class="px-4 h-9 py-2 bg-pink-500 text-white text-sm rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:bg-blue-600 delete-ingredient">Delete</button>
                <button type="submit" class="px-4 h-9 py-2 bg-pink-500 text-white text-sm rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:bg-blue-600 save-ingredient hidden">Save</button>
            </div>
        </div>
    </li>
    `
    
}

let currentRecipeId = null;

list.addEventListener("click", (e) => {
    e.preventDefault()
    
    console.log(e.target)
    if(e.target.parentElement.classList.contains("recipe-list") || e.target.parentElement.parentElement.classList.contains("recipe-list") && e.target.tagName == "DIV") {
        currentRecipeId = e.target.closest('li').getAttribute("data-id")
        
        showDescription()
        showIngredients() 
        atStart.classList.remove("align-to-center")
        title.classList.remove("text-center")
        if (descriptionContainer.classList.contains("hidden")) {
            descriptionContainer.classList.remove("hidden")
        }
        if (ingredientsContainer.classList.contains("hidden")) {
            ingredientsContainer.classList.remove("hidden")
        }
    }
    console.log(currentRecipeId)
})

updateDescription.addEventListener("click", async (e) => {
    e.preventDefault()
    const docRef = doc(db, "recipes", currentRecipeId)
    try {
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                description: textarea.value
            })
            console.log("Description updated succesfully")
        }
    }
    catch (error) {
        console.log(error)
    }
    descriptionContent.innerHTML = textarea.value
    textarea.classList.add("hidden")
    descriptionContent.classList.remove("hidden")
    updateDescription.classList.add("hidden")
    editDescriptionButton.classList.remove("hidden")
})

const showDescription = async () => {
    descriptionContent.innerHTML = ''
    textarea.classList.add("hidden")
    descriptionContent.classList.remove("hidden")
    updateDescription.classList.add("hidden")
    editDescriptionButton.classList.remove("hidden")
    try {
        const recipe = doc(db, "recipes", currentRecipeId)
        const recipeSnapshot = await getDoc(recipe)
        descriptionContent.innerHTML  = `<div class="">${recipeSnapshot.data().description}</div>`
        
    }
    catch(error) {
        console.log(error)
    }
}

editDescriptionButton.addEventListener("click", async (e) => {
    e.preventDefault()
    textarea.value = descriptionContent.textContent
    // const showCurrentTextarea = async () => {
    //     const recipe = doc(db, "recipes", currentRecipeId)
    //     const recipeSnapshot = await getDoc(recipe)
    //     textarea.value = await recipeSnapshot.data().description
    // }
    // showCurrentTextarea()
    editDescriptionButton.classList.add("hidden")
    textarea.classList.remove("hidden")
    descriptionContent.classList.add("hidden")
    updateDescription.classList.remove("hidden")
    
})

const showIngredients = async () => {
    ingList.innerHTML = ''
    try {
        const recipe = doc(db, "recipes", currentRecipeId)
        const recipeSnapshot = await getDoc(recipe)
        for (let i = 0; i < recipeSnapshot.data().ingredients.length; i++) {
            ingList.innerHTML += 
        `
        <li class="mb-4">
            <div class="flex items-center justify-between border-2 rounded-lg p-2">
                <textarea class="hidden edit-ingredient-box" name=""></textarea>
                <span class="current-ingredient">${recipeSnapshot.data().ingredients[i]}</span>
                <div class="flex flex-row items-center">
                    <button type="submit" class="mr-1 block h-9 w-16 py-2 bg-pink-500 text-white text-sm rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:bg-blue-600 edit-ingredient">Edit</button>
                    <button type="submit" class="px-4 h-9 py-2 bg-pink-500 text-white text-sm rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:bg-blue-600 delete-ingredient">Delete</button>
                    <button type="submit" class="px-4 h-9 py-2 bg-pink-500 text-white text-sm rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:bg-blue-600 save-ingredient hidden">Save</button>
                </div>
            </div>
        </li>
        `
        }
    }
    catch (error) {
        console.log(error)
    }
}

ingForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    // const recipe = doc(db, "recipes", currentRecipeId)
    const docRef = doc(db, "recipes", currentRecipeId)
    
    try {
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
            await updateDoc(docRef, {
                ingredients: arrayUnion(ingForm.ingredient.value)
            })
            console.log("Ingredient added succesfully")
        }
        
    }
    catch (error) {
        console.log(error)
    }

    addIngredient(ingForm.ingredient.value)

    ingForm.reset()
})

ingList.addEventListener("click", async e => {
    if (e.target.classList.contains("delete-ingredient")) {
        e.target.parentElement.parentElement.remove()

    const docRef = doc(db, "recipes", currentRecipeId)
    const docSnapshot  = await getDoc(docRef)
    console.log(e.target.parentElement.parentElement.innerText)
    console.log(e.target.parentElement.parentElement.innerText.trim().split("\n")[0])
    try {
        if(docSnapshot.exists()) {
            await updateDoc(docRef, {
                ingredients: arrayRemove(e.target.parentElement.parentElement.innerText.trim().split("\n")[0])
                
            })
        }
        console.log(`"${e.target.parentElement.parentElement.innerText.trim().split("\n")[0]}" deleted succesfully`)
    }
    catch (error) {
        console.log(error)
    }
    }
    
})


// Edit ingredient button
ingList.addEventListener("click", e => {
    if (e.target.classList.contains("edit-ingredient")) { 
        e.target.parentElement.previousElementSibling.previousElementSibling.innerHTML = 
        `${e.target.parentElement.parentElement.innerText.split("\n")[0]}`
        e.target.parentElement.previousElementSibling.classList.add("hidden")
        e.target.parentElement.previousElementSibling.previousElementSibling.classList.remove("hidden")      
        e.target.classList.add("hidden")
        e.target.nextElementSibling.classList.add("hidden")
        e.target.nextElementSibling.nextElementSibling.classList.remove("hidden")
    }
    
})

// Save ingredient button
let newValue;
ingList.addEventListener("click", e => {
    if (e.target.classList.contains("save-ingredient")) {
        const oldValue = e.target.parentElement.previousElementSibling.innerHTML
        console.log(e.target.parentElement.previousElementSibling.innerHTML)
        e.target.classList.add("hidden")
        e.target.previousElementSibling.classList.remove("hidden")
        e.target.previousElementSibling.previousElementSibling.classList.remove("hidden")
        newValue = e.target.parentElement.previousElementSibling.previousElementSibling.value
        e.target.parentElement.previousElementSibling.textContent = newValue
        e.target.parentElement.previousElementSibling.classList.remove("hidden")
        e.target.parentElement.previousElementSibling.previousElementSibling.classList.add("hidden")
        const ingredientUpdate = document.querySelectorAll(".edit-ingredient-box")
        ingredientUpdate.forEach(ingredient => {
            if (ingredient.innerText == oldValue) {
                ingredient.innerText = newValue
                console.log(ingredientUpdate)
            }
        })
        const updateIngredient = async () => {
            try {
                const docRef = doc(db, "recipes", currentRecipeId)
                const docSnapshot = await getDoc(docRef)
                const currentArray = docSnapshot.data()["ingredients"];
                const index = currentArray.indexOf(oldValue)
                const newArray = [...currentArray]
                console.log(index)
                newArray[index] = newValue
                await updateDoc(docRef, {["ingredients"]: newArray})
            }
            catch (error) {
                console.log(error)
            }
            
        }
        updateIngredient()
        
    }
    
})

// Part 1 - Get documents

// const fetchRecipes2 = async() => {
//     try{
//         const recipesCollection = collection(db, 'recipes');
        
//         const snapshot = await getDocs(recipesCollection);

//         snapshot.forEach(doc => {
//             // console.log(doc.data()); //json

//             // console.log(doc.id); //unique id given to the document

//             addRecipe(doc.data(), doc.id);
//         });
//     }
//     catch(err){
//         console.log(err);
//     }
// }


const fetchRecipes = () => {
    //onSnapshot() - constantly listen to a document change

    const recipesCollection = collection(db, "recipes");

    //this cb function (2nd input) is going to execute everytime when there's changes

    // the onsnapshot has 2 kinds of changes (type: "added", type: "removed")
    onSnapshot(recipesCollection, (snapshot) => {
        console.log(snapshot.docChanges());

        snapshot.docChanges().forEach(change => {
            console.log(change.doc.data());

            const doc = change.doc;

            if(change.type === "added"){
                addRecipe(doc.data(), doc.id);
            }
            if(change.type === "removed"){
                deleteRecipe(doc.id);
            }
        });
    })
}

fetchRecipes();

//Part 2 - Add document

form.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const now = new Date(); //JS date

    // create a JSON object to add to firestore collection
    const recipe = {
        title: form.recipe.value,
        createdAt: Timestamp.fromDate(now),
        description: "",
        ingredients: []
        //create a Firestore timestamp object from JS 
    }

    form.reset();

    try{
        const recipesCollection = collection(db, "recipes");
        const docRef = await addDoc(recipesCollection, recipe)
        
        console.log("Recipe added with ID: " + docRef.id);
    }
    catch(err){
        console.log(err);
    }
})

// Part 3 - delete document

list.addEventListener("click", async(e) => {
    e.preventDefault()

    if(e.target.classList.contains('delete')){
        const id = e.target.parentElement.getAttribute("data-id");

        console.log(id);

        try{
            const docRef = doc(db, "recipes", id);

            await deleteDoc(docRef);
            console.log("Recipe delete with ID" + id);
        }
        catch(err){
            console.log(err);
        }
        descriptionContainer.classList.add("hidden")
        ingredientsContainer.classList.add("hidden")
        atStart.classList.add("align-to-center")
        title.classList.add("text-center")
    }
})