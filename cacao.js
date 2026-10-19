function ir(id){
    document.getElementById(id).scrollIntoView();
}

document.getElementById("form").addEventListener("submit",socios=>{
    socios.preventDefault();
    let nombre=document.getElementById("nombre").value;
    document.getElementById("mensaje").textContent=
    "¡Bienvenido al club, "+nombre+"!";
    socios.target.reset();
});
