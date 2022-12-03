document.getElementById("enviar-login").addEventListener("click", handleClick);


function handleClick(){
    let cpf = document.getElementById("cpf").value;
    let senha = document.getElementById("senha").value;

    if(cpf && senha){
        const url = 'http://localhost:8080/api/usuario/login';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                cpf,
                senha,
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then(data => {
            console.log(data.status)
            if(data.status != 200){
                alert("Credenciais inválidas!")
                localStorage.setItem("auth","false");
            }else{
                window.location.href = './home.html';
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
