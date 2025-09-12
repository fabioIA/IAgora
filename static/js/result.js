carregar_dados()

async function carregar_dados() {
    await fetch("/dados")
    .then(r => r.json())
    .then(resposta => {
        const userId = resposta.id_usuario
        var humano = [0, 0]
        var chatgpt = [0, 0]
        var gemini = [0, 0]
        var deepseek = [0, 0]

        // Pegando acertos e erros do humano, chatgpt, gemini e deepseek
        resposta.dados.forEach(obj => {
            let pointer
            if(obj.id_pessoa == userId)
            {
                if(obj.acertou == 's')
                    pointer = 1 
                else
                    pointer = 0

                humano[pointer == 0 ? 1 : 0]++

                if(obj.ia_utilizada == "chatgpt") chatgpt[pointer]++
                if(obj.ia_utilizada == "gemini") gemini[pointer]++
                if(obj.ia_utilizada == "deepseek") deepseek[pointer]++
            }   
        });

        let percentHumano = humano[0]/(humano[0] + humano[1])
        let percentChatgpt = chatgpt[0]/(chatgpt[0] + chatgpt[1])
        let percentGemini = gemini[0]/(gemini[0] + gemini[1])
        let percentDeepseek = deepseek[0]/(deepseek[0] + deepseek[1])
        
        if(parseInt(percentChatgpt*100) > 0)
        {
            document.querySelector('.bars').innerHTML += `
            <span class="ia">ChatGPT:</span>
            <div class="box">
                <div class="bar" style="width: ${parseInt(percentChatgpt*100)}%" id="ChatGPT">${parseInt(percentChatgpt*100)}%</div>
            </div>`
        }

        if(parseInt(percentGemini*100) > 0)
        {
            document.querySelector('.bars').innerHTML += `
            <span class="ia">Gemini:</span>
            <div class="box">
                <div class="bar" style="width: ${parseInt(percentGemini*100)}%" id="Gemini">${parseInt(percentGemini*100)}%</div>
            </div>`
        }

        if(parseInt(percentDeepseek*100) > 0)
        {
            document.querySelector('.bars').innerHTML += `
            <span class="ia">DeepSeek</span>
            <div class="box">
                <div class="bar" style="width: ${parseInt(percentDeepseek*100)}%" id="DeepSeek">${parseInt(percentDeepseek*100)}%</div>
            </div>`
        }

        let win = [
            "Você não se deixa enganar! Parabéns", 
            "Você foi esperto! A IA não te enganou! Parabéns",
            "Excelente! Você mostrou que pensa além da máquina!"
        ]
        let won = [
            "Cuidado! A IA enganou você dessa vez!", 
            "A IA está se comportando be! Fique mais antento",
            "Ops! Dessa vez a IA conseguiu te confundir."
        ]
        let draw = [
            "Empate! Você e a IA ficaram no mesmo nível dessa vez.",
            "Quase lá! Dessa vez foi empate entre você e a IA.",
            "Nada definido! O jogo ficou equilibrado."
        ]

        if(parseInt(percentHumano * 100) > 50)
            document.getElementById("message").innerHTML = win[Math.floor(Math.random() * 3)]

        else if(parseInt(percentHumano * 100) < 50)
            document.getElementById("message").innerHTML = won[Math.floor(Math.random() * 3)]

        else
            document.getElementById("message").innerHTML = draw[Math.floor(Math.random() * 3)]

        // Barra de progresso circular
        if(parseInt(percentHumano * 100) > 0)
        {
            document.getElementById("percentCircle").innerHTML = `Você acertou ${parseInt(percentHumano * 100)}% das perguntas`
            p = Math.max(0, Math.min(100, parseInt(percentHumano * 100))); // limita entre 0 e 100
            document.querySelector('.text').textContent = p + "%";
            document.querySelector(".text").style.fill = '#2563eb'
            document.querySelector(".cprogress").style.stroke = '#2563eb'
        }
        else
        {
            document.getElementById("percentCircle").innerHTML = 'Você não acertou nenhuma pergunta'
            document.querySelector('.text').textContent = '0%';
            document.querySelector(".text").style.fill = '#000'
        }

        document.querySelector('.cprogress').style.strokeDashoffset = 100 - p;
    });
}
