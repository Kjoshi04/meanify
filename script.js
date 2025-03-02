const form= document.querySelector('form');
const resultDiv= document.querySelector('.result');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    getWordinfo(form.elements[0].value);
});
const getWordinfo = async(word)=>{
    try{
    resultDiv.innerHTML = " Fetching data...";    
    const response= await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    const data= await response.json();
    let definitions=data[0].meanings[0].definitions[0];

    let audioSrc = "";
    for (let phonetic of data[0].phonetics) {
        if (phonetic.audio) {
            audioSrc = phonetic.audio;
            break; // Stop once we find a valid audio link
        }
    }

    resultDiv.innerHTML= `
        <h2><strong>Word: </strong>${data[0].word}</h2> 
        <p class="partOfSpeech">${data[0].meanings[0].partOfSpeech}</p> 
        <p><strong>Meaning: </strong>${definitions.definition === undefined ? "Not Found": definitions.definition}</p>
        <p><strong>Example: </strong>${definitions.example === undefined ? "Not Found": definitions.example}</p>
        <p><strong>Synonyms: </strong></p>

    `; 
    // Fetching synonyms
        if(definitions.synonyms.length === 0){
            resultDiv.innerHTML += `<span> Not Found </span>`
        }
        else{
            for(let i=0; i<definitions.synonyms.length;i++){
                resultDiv.innerHTML +=`<li>${definitions.synonyms[i]}</li>`
            }
        }

    resultDiv.innerHTML+= `<p><strong>Antonyms: </strong></p>`

    // Fetching antonyms
    if(definitions.antonyms.length === 0){
        resultDiv.innerHTML += `<span> Not Found </span>`
    }
    else{
        for(let i=0; i<definitions.antonyms.length;i++){
            resultDiv.innerHTML +=`<li>${definitions.antonyms[i]}</li>`
        }
    }
    

    if (audioSrc) {
        resultDiv.innerHTML += `
            <div>
                <p><strong>Pronunciation: </strong></p>
                <audio controls>
                    <source src="${audioSrc}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            </div>
        `;
    } else {
        resultDiv.innerHTML += `<p><strong>Pronunciation: </strong> Not Available </p>`;
    }
    // Adding Read more button
    resultDiv.innerHTML += `<div><a href="${data[0].sourceUrls}" target="_blank">Read More</a></div>`

     }
    catch(error){
        resultDiv.innerHTML =`<p> Word Not Found </p>`
    }
    console.log(data);
}
