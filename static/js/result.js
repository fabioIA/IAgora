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
        var mediaPessoas = [{}]

        // Pegando acertos e erros do humano, chatgpt, gemini e deepseek
        resposta.dados.forEach(obj => {
            if(obj.acertou == 's')
            {
                if(obj.ia_utilizada == "chatgpt") chatgpt[1]++
                if(obj.ia_utilizada == "gemini") gemini[1]++
                else deepseek[1]++
                
                if(obj.id_pessoa == userId) humano[0]++
                else
                {
                    let achou = false
                    mediaPessoas.forEach(el => {
                        if(el.id == obj.id_pessoa) 
                        {
                            el.acertos++
                            achou = true
                        }
                    })

                    if(!achou)
                        mediaPessoas.push({"id": obj.id_pessoa, "acertos": 0, "erros": 0})
                }
            }
            else
            {
                if(obj.ia_utilizada == "chatgpt") chatgpt[0]++
                if(obj.ia_utilizada == "gemini") gemini[0]++
                else deepseek[0]++

                if(obj.id_pessoa == userId)  humano[1]++
                else
                {
                    let achou = false
                    mediaPessoas.forEach(el => {
                        if(el.id == obj.id_pessoa) 
                        {
                            el.erros++
                            achou = true
                        }
                    })

                    if(!achou)
                        mediaPessoas.push({"id": obj.id_pessoa, "acertos": 0, "erros": 0})
                }
            }   
        });

        document.getElementById("acertos").innerHTML = `${humano[0]} de ${humano[0] + humano[1]} acerto(s)`

        let prcentHumano = (humano[0]/(humano[0] + humano[1]))
        let prcentChatgpt = chatgpt[0]/(chatgpt[0] + chatgpt[1])
        let prcentGemini = gemini[0]/(gemini[0] + gemini[1])
        let prcentDeepseek = deepseek[0]/(deepseek[0] + deepseek[1])

        var mediaIas = (prcentGemini + prcentChatgpt + prcentDeepseek) / 3
        
        var lenghts = [
            (prcentHumano) * 100, 
            (prcentHumano - mediaIas) * 100, 
            (prcentHumano - prcentChatgpt) * 100, 
            (prcentHumano - prcentGemini) * 100,
            (prcentHumano - prcentDeepseek) * 100,
        ]
        var count = 0;

        // Barra de progresso retuangular
        document.querySelectorAll(".progress").forEach((el) => {
            const percent = el.parentElement.querySelector(".percent"); 

            console.log(lenghts[count]);
            
            if(parseInt(lenghts[count]) > 0)
            {
                el.style.backgroundColor = '#22c55e'

                for (let i = 0; i <= parseInt(lenghts[count]); i++) 
                {
                    setTimeout(() => {
                        el.style.width = `${i}%`
                    }, 700*(count+1));

                    percent.innerHTML = `${i}%`
                    percent.style.color = '#fff'
                }
                count+=1
            }
            else
            { 
                if(Number(lenghts[count] == 0))
                    percent.innerHTML = "0%"
                else
                    el.style.backgroundColor = '#EF4444'

                for (let i = 0; i <= -parseInt(lenghts[count]); i++) 
                {
                    setTimeout(() => {
                        el.style.width = `${i}%`
                    }, 700*(count+1));

                    percent.innerHTML = `-${i}%`
                    percent.style.color = '#fff'
                }
                count+=1
            }
        })

        let sum = 0.0
        mediaPessoas.forEach(el => {
            let  total = el.acertos + el.erros
            
            if(total > 0)
                sum = sum + el.acertos / (el.acertos + el.erros)
        })

        let media = sum / mediaPessoas.length
        let acimaMedia = parseInt((prcentHumano - media) * 100)


        document.getElementById("message").innerHTML = messageMedia(acimaMedia)

        var p
        // Barra de progresso circular
        if(acimaMedia > 0)
        {
            document.getElementById("percentCircle").innerHTML = `Você está ${acimaMedia}% acima da média`
            p = Math.max(0, Math.min(100, acimaMedia)); // limita entre 0 e 100
            document.querySelector('.text').textContent = p + "%";
            document.querySelector(".text").style.fill = '#22c55e'
            document.querySelector(".cprogress").style.stroke = '#22c55e'

        }
        else
        {
            document.getElementById("percentCircle").innerHTML = `Você está ${-acimaMedia}% abaixo da média`
            p = Math.max(0, Math.min(100, -acimaMedia)); // limita entre 0 e 100
            document.querySelector('.text').textContent = `-${p}%`;
            document.querySelector(".text").style.fill = '#EF4444'
            document.querySelector(".cprogress").style.stroke = '#EF4444'
        }

        document.querySelector('.cprogress').style.strokeDashoffset = 100 - p;
    });
}

function messageMedia(acimaMedia) {
    if (acimaMedia < 0) return "Continue praticando! Você ainda pode superar a média."
    else if (acimaMedia < 10) return "Você ficou um pouco acima da média. Bom começo!"
    else if (acimaMedia < 25) return "Parabéns! Você está bem acima da média."
    else if (acimaMedia < 50) return "Excelente! Sua taxa de acerto mostra que você tem um talento especial."
    else if (acimaMedia < 70) return "Incrível! Você está no topo, com desempenho muito acima da média."
    else return "Lendário! Seu desempenho está muito além da média, poucos chegam nesse nível."
}
