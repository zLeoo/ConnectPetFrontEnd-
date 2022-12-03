document.getElementById("registrar").addEventListener("click", handleClick);


function handleClick(){

    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let dataNascimento = document.getElementById("dataNascimento").value;
    let email = document.getElementById("email").value;
    let cidade = document.getElementById("cidade").value;
    let estado = document.getElementById("estado").value;
    let senha = document.getElementById("senha").value;

    if(dataNascimento) console.log(typeof dataNascimento, dataNascimento)

    if(nome && cpf && dataNascimento && email && cidade && estado && senha){
        const url = 'http://localhost:8080/api/usuario';
        console.log(nome , cpf , dataNascimento , email , cidade , estado , senha, dataNascimento)

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                nome,
                cpf,
                dataNascimento,
                email,
                cidade,
                estado,
                senha 
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(data => {
            console.log(data.status)
            if(data.status != 200){
                alert("Usuário não foi registrado!")
                localStorage.setItem("auth","false");
            }else{
                window.location.href = './home.html';
                alert('Usuário cadastrado com sucesso :D')
                localStorage.setItem("auth","true");
            }
            return data.json();
        })
        .then(res => {
            console.log(res)
        })
        .catch(error => alert('Erro dados inválidos!'));
        
    }else{
        alert('Preencha todos os campos!');
    }
}
