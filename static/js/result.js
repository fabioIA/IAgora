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

        //document.getElementById("acertos").innerHTML = `${humano[0]} de ${humano[0] + humano[1]} acerto(s)`

        let prcentHumano = (humano[0]/(humano[0] + humano[1]))
        let prcentChatgpt = chatgpt[0]/(chatgpt[0] + chatgpt[1])
        let prcentGemini = gemini[0]/(gemini[0] + gemini[1])
        let prcentDeepseek = deepseek[0]/(deepseek[0] + deepseek[1])
        var mediaIas = (prcentGemini + prcentChatgpt + prcentDeepseek) / 3
        
        const ctx = document.getElementById('graph').getContext('2d');

        const dados = {
            labels: ['IAs', 'Chatgpt', 'Gemini', 'DeepSeek'],
            datasets: [{
            label: 'Variação (%)',
            data: [parseInt((prcentHumano - mediaIas) * 100), parseInt((prcentHumano - prcentChatgpt) * 100), parseInt((prcentHumano - prcentGemini) * 100), parseInt((prcentHumano - prcentDeepseek) * 100)],
            backgroundColor: function(ctx) {
                const valor = ctx.dataset.data[ctx.dataIndex];
                return valor >= 0 ? '#22c55e' : '#EF4444';
            },
            borderRadius: 6,
            }]
        };

        const opcoes = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                label: context => `${context.parsed.y}%`
                }
            },
            datalabels: {
                anchor: 'center',
                align: 'center',
                formatter: value => `${value}%`,
                color: 'white',
                font: { weight: 'bold' }
            }
            },
            scales: {
            y: {
                beginAtZero: true,
                grid: { display: false },
                border: { display: false },
                ticks: { display: false }
            },
            x: {
                border: { display: false },
                ticks: { maxRotation: 90, minRotation: 45 },
                grid: { display: false }
            }
            }
        };

        new Chart(ctx, {
            type: 'bar',
            data: dados,
            options: opcoes,
            plugins: [ChartDataLabels]
        });

        let sum = 0.0
        mediaPessoas.forEach(el => {
            let  total = el.acertos + el.erros
            
            if(total > 0)
                sum = sum + el.acertos / (el.acertos + el.erros)
        })

        //Mensagem
        //document.getElementById("message").innerHTML = messageMedia(prcentHumano)

        var p
        prcentHumano = parseInt(prcentHumano * 100)
        // Barra de progresso circular
        if(prcentHumano > 0)
        {
            document.getElementById("percentCircle").innerHTML += `, você acertou ${prcentHumano}% das vezes`
            p = Math.max(0, Math.min(100, prcentHumano)); // limita entre 0 e 100
            document.querySelector('.text').textContent = p + "%";
            document.querySelector(".text").style.fill = '#22c55e'
            document.querySelector(".cprogress").style.stroke = '#22c55e'
        }
        else if(prcentHumano < 0)
        {
            document.getElementById("percentCircle").innerHTML += `, você acertou ${-prcentHumano}% das vezes`
            p = Math.max(0, Math.min(100, -prcentHumano)); // limita entre 0 e 100
            document.querySelector('.text').textContent = `-${p}%`;
            document.querySelector(".text").style.fill = '#EF4444'
            document.querySelector(".cprogress").style.stroke = '#EF4444'
        }
        else
        {
            document.getElementById("percentCircle").innerHTML += ', você não acertou nenhuma vez'
            document.querySelector('.text').textContent = '0%';
            document.querySelector(".text").style.fill = '#000'
        }

        document.querySelector('.cprogress').style.strokeDashoffset = 100 - p;
    });
}

function messageMedia(prcentHumano) {
    if (prcentHumano < 0) return "Continue praticando! Você ainda pode superar a média."
    else if (prcentHumano < 10) return "Você ficou um pouco acima da média. Bom começo!"
    else if (prcentHumano < 25) return "Parabéns! Você está bem acima da média."
    else if (prcentHumano < 50) return "Excelente! Sua taxa de acerto mostra que você tem um talento especial."
    else if (prcentHumano < 70) return "Incrível! Você está no topo, com desempenho muito acima da média."
    else return "Lendário! Seu desempenho está muito além da média, poucos chegam nesse nível."
}
