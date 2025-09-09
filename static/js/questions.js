var selected = "none";

document.addEventListener("click", (e) => {
    const resp = e.target.closest(".resp");
    if (!resp) return;

    document.querySelectorAll(".input-resp").forEach(r =>
        r.classList.remove("selected")
    );

    const textarea = resp.querySelector(".input-resp");
    textarea.classList.add("selected");
    selected = (textarea.value || "").trim();
});

if (document.getElementById("number").innerHTML == "1") {
    document.getElementById("finish").style.display = "none";
    document.getElementById("next").style.width = "100%";
}

function getOpinion() {
    const opinionField = document.getElementById("opinion");
    return opinionField ? opinionField.value.trim() : "";
}

// Botão Próximo
document.getElementById("next").addEventListener("click", async () => {
    await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        resposta_dada: selected,
        opiniao: getOpinion()  
        })
    }).then(r => {
        if (r.redirected) {
        window.location.href = r.url;
        }
    });
});

// Botão Finalizar
document.getElementById("finish").addEventListener("click", async () => {
    const r = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        resposta_dada: selected,
        opiniao: getOpinion(),
        finalizar: true
        })
    });

    if (r.redirected) 
    {
        window.location.href = r.url;   // deve ir para /resultado
    }
    else 
    {
        window.location.href = "/resultado";
    }
});