if(localStorage.getItem("auth") != "true"){
    window.location.href = './index.html';
    alert('Usuário não autenticado!')
}

document.getElementById("enviar-doacao").addEventListener("click", handleCreate);


function handleCreate(){
    let nome = document.getElementById("nome").value;
    let especie = document.getElementById("especie").value;
    let sexo = document.getElementById("sexo").value;
    let idade = document.getElementById("idade").value;
    let email = document.getElementById("email").value;
    let imagem = document.getElementById("imagem").files[0];

    

    if(nome && especie && sexo && idade && email  && imagem){
        idade = parseInt(idade)
        const jsonData = JSON.stringify({ nome, especie, idade, sexo, email});
        //fazer chamada para a api
        const formData = new FormData();
        formData.append("image", imagem);
        formData.append("jsonData", jsonData);
        
        const url = 'http://localhost:8080/api/doacoes';

        fetch(url, {
            method: 'POST',
            body: formData
        }).then(data => {
            if(data.status != 200){
                alert("Erro ao cadastrar!")
            }else{
                window.location.href = './feed.html';
            }
            return data.json();
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => console.log('Something failed: ' + error.message));
        
    }else{
        alert('Preencha todos os campos!');
    }

}



