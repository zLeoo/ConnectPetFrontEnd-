if(localStorage.getItem("auth") != "true"){
    window.location.href = './index.html';
    alert('Usuário não autenticado!')
}

console.log(localStorage.getItem("auth"))


const url = 'http://localhost:8080/api/doacoes/listar';

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Origin','http://localhost:8080');

fetch(url).then(data => {
    return data.json();
})
.then(res => {
    console.log(res)
    res.forEach((item) => {
        createFeed(item);
    })
    setupModal();
    handleWindowClick();
})
.catch(error => console.log('Authorization failed: ' + error.message));


document.getElementById("atualizar-doacao").addEventListener("click", handleUpdate);
document.getElementById("deletar-doacao").addEventListener("click", handleDelete);

function handleUpdate(event){
    let id = document.getElementById("editModal").dataset.id;
    let nome = document.getElementById("nome").value;
    let especie = document.getElementById("especie").value;
    let sexo = document.getElementById("sexo").value;
    let idade = document.getElementById("idade").value;
    let email = document.getElementById("email").value;
    let imagem = document.getElementById("imagem").files[0];

    if(nome && especie && sexo && idade && email && imagem){
        idade = parseInt(idade)
        const jsonData = JSON.stringify({ nome, especie, idade, sexo, email });
        //fazer chamada para a api
        const formData = new FormData();
        formData.append("idDoacao", id)
        formData.append("image", imagem);
        formData.append("jsonData", jsonData);
        
        const url = `http://localhost:8080/api/doacao/${id}`;

        fetch(url, {
            method: 'PUT',
            body: formData
        }).then(data => {
            if(data.status != 200){
                alert("Erro ao atualizar!")
            }else{
                window.location.href = './feed.html';
            }
            return data.json();
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => alert('Erro: ' + error.message));
        
    }else{
        alert('Preencha todos os campos!');
    }
}

function handleDelete(){
    let id = document.getElementById("deleteModal").dataset.id;
    console.log(id)
    if(id){
        
        const url = `http://localhost:8080/api/doacao/${id}`;

        fetch(url, {
            method: 'DELETE'
        }).then(data => {
            if(data.status != 200){
                alert("Erro ao deletar!")
            }else{
                window.location.href = './feed.html';
            }
            return data.json();
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => console.log('Something failed: ' + error.message));
        
    }

}




function createFeed(response){
    let pronome;
    if(response.sexo == "Macho") pronome = 'o';
    if(response.sexo == "Fêmea") pronome = 'a';

    const emailSubject = "Interesse em Adoção"
    const emailBody = `Olá, tenho interesse em adotar ${pronome} ${response.nome}.`

    const card = `
        <div class="card" id="card-${response.id}">
            <div class="dropdown">
                <!-- three dots -->
                <ul class="dropbtn icons btn-right showLeft" id="${response.id}" onclick="showDropdown(event)">
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <!-- menu -->
                <div id="myDropdown-${response.id}" class="dropdown-content">
                    <a id="editBtn" class="editBtn" >Editar</a> 
                    <a id="deleteBtn" class="deleteBtn">Deletar</a>
                </div>
            </div>
           
            <div class="imagem" style="background-image: url('./../..${response.imagem.slice(14)}');"></div>
            <div class="card-body" id="cardBody" data-id=${response.id}>
                <h2 class="card-title" id="cardTitle" data-value=${response.nome} >${response.nome}</h2>
                <h3 id="cardEspecie" data-value=${response.especie}>Especie: ${response.especie}</h3>
                <h3 id="cardSexo" data-value=${response.sexo}>Sexo: ${response.sexo}</h3>
                <h3 id="cardIdade" data-value=${response.idade}>Idade: ${response.idade} Ano(s)</h3>
                <a data-email=${response.email} href="mailto:${response.email}?subject=${emailSubject}&body=${emailBody}" class="btn-primary">Quero Adotar</a>
            </div>
        </div>`;
        
    document.getElementById("feed-container").innerHTML += card;
    
}


    function showDropdown(event) {
        const id = event.srcElement.id

        document.getElementById("myDropdown-"+ id).classList.toggle("show");
    }

    

function setupModal(){
    //modal setup 
    let editModal = document.getElementById("editModal");
    let deleteModal = document.getElementById("deleteModal");

    // Get the button that opens the modal
    let listBtnEdit = document.getElementsByClassName("editBtn");
    let listBtnDel = document.getElementsByClassName("deleteBtn");

    for(let i = 0; i < listBtnEdit.length; i++){
        listBtnEdit[i].onclick = function(event) {
            editModal.style.display = "flex";
            
            let path = event.composedPath()
            //console.log(path[3].children)
            let nome = path[3].children[2].childNodes[1].dataset.value;
            let especie = path[3].children[2].childNodes[3].dataset.value;
            let sexo = path[3].children[2].childNodes[5].dataset.value;
            let idade = path[3].children[2].childNodes[7].dataset.value;
            let email = path[3].children[2].childNodes[9].dataset.email;

            document.getElementById("nome").value = nome;
            document.getElementById("especie").value = especie;
            document.getElementById("sexo").value = sexo;
            document.getElementById("idade").value = idade ;
            document.getElementById("email").value = email ;

            editModal.dataset.id = path[3].children[2].dataset.id
        } 
    }

    for(let i = 0; i < listBtnDel.length; i++){
        listBtnDel[i].onclick = function(event) {
            deleteModal.style.display = "flex";

            let path = event.composedPath()
            deleteModal.dataset.id = path[3].children[2].dataset.id
        }
    }




    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close");

    for(let i = 0; i < span.length; i++){
        span[i].onclick = function() {
            editModal.style.display = "none";
            deleteModal.style.display = "none";
        }
    }
    
    // When the user clicks on <span> (x), close the modal
    

    //setar valores do form
}

function handleWindowClick(){
    let editModal = document.getElementById("editModal");
    let deleteModal = document.getElementById("deleteModal");

    window.onclick = function(event) {
        // When the user clicks anywhere outside of the modal, close it
        if (event.target == editModal || event.target == deleteModal) {
            editModal.style.display = "none";
            deleteModal.style.display = "none";
        }
        

        // Close the dropdown if the user clicks outside of it
        if (!event.target.matches('.dropbtn')) {
            let dropdowns = document.getElementsByClassName("dropdown-content");
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
}
