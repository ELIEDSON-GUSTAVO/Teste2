let itens = [];
let editandoItemIndex = -1;
let editandoPecaIndex = -1;
const pecasSelecionadas = {}; // Objeto para armazenar o estado de seleção das peças

// Função para adicionar ou editar um item
function adicionarOuEditarItem() {
    const nomeItem = document.getElementById("itemNome").value.trim();
    if (!nomeItem) {
        alert("Por favor, insira um nome para o item.");
        return;
    }

    if (editandoItemIndex === -1) {
        itens.push({ nome: nomeItem, pecas: [], quantidade: 1 }); // Quantidade padrão é 1
    } else {
        itens[editandoItemIndex].nome = nomeItem;
        editandoItemIndex = -1;
    }

    document.getElementById("itemNome").value = "";
    atualizarListaItens();
    atualizarSelectItens();
}

// Função para adicionar ou editar uma peça
function adicionarOuEditarPeca() {
    const codigoPeca = document.getElementById("pecaCodigo").value.trim();
    const quantidade = parseInt(document.getElementById("pecaQuantidade").value.trim());
    const unidade = document.getElementById("pecaUnidade").value.trim();
    const descricao = document.getElementById("pecaDescricao").value.trim();
    const itemSelecionadoIndex = document.getElementById("itemSelect").value;

    if (itemSelecionadoIndex === "") {
        alert("Por favor, selecione um item.");
        return;
    }

    if (!codigoPeca || quantidade <= 0 || !unidade || !descricao) {
        alert("Por favor, preencha todos os campos da peça.");
        return;
    }

    const itemIndex = parseInt(itemSelecionadoIndex);
    if (editandoPecaIndex === -1) {
        itens[itemIndex].pecas.push({ codigo: codigoPeca, quantidade, unidade, descricao });
    } else {
        itens[itemIndex].pecas[editandoPecaIndex] = { codigo: codigoPeca, quantidade, unidade, descricao };
        editandoPecaIndex = -1;
    }

    document.getElementById("pecaCodigo").value = "";
    document.getElementById("pecaQuantidade").value = "";
    document.getElementById("pecaUnidade").value = "";
    document.getElementById("pecaDescricao").value = "";
    atualizarListaPecas(itemIndex);
}

// Função para atualizar a lista de itens na tabela
function atualizarListaItens() {
    const itensBody = document.getElementById("itensBody");
    itensBody.innerHTML = "";
    itens.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" onchange="selecionarItem(${index}, this)" ${pecasSelecionadas[index] ? 'checked' : ''}></td>
            <td>${item.nome} (${item.pecas.length} peças)</td>
            <td><input type="number" min="1" value="${item.quantidade}" onchange="atualizarQuantidadeItem(${index}, this.value)"></td>
            <td>
                <button onclick="editarItem(${index})">Editar</button>
                <button onclick="excluirItem(${index})">Excluir</button>
                <button onclick="verPecas(${index})">Ver Peças</button>
            </td>
        `;
        itensBody.appendChild(tr);
    });
}

// Função para atualizar a quantidade de um item
function atualizarQuantidadeItem(itemIndex, quantidade) {
    itens[itemIndex].quantidade = parseInt(quantidade);
}

// Função para gerar um arquivo Excel
function gerarExcel() {
    const wb = XLSX.utils.book_new();
    const dados = [];

    itens.forEach(item => {
        const quantidadeItem = item.quantidade || 1; // Quantidade padrão é 1
        item.pecas.forEach(peca => {
            dados.push([
                item.nome,
                peca.codigo,
                peca.quantidade * quantidadeItem, // Multiplica a quantidade da peça pela quantidade do item
                peca.unidade,
                peca.descricao
            ]);
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(dados);
    XLSX.utils.book_append_sheet(wb, ws, "Itens e Peças");
    XLSX.writeFile(wb, "itens_e_pecas.xlsx");
}

// Função que será chamada assim que a página for carregada
window.onload = function() {
    atualizarListaItens();
};