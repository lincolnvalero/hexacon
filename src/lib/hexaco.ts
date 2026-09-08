/**
 * Modelo HEXACO — estrutura e pontuação oficiais (6 fatores × 4 facetas +
 * escala interpessoal Altruísmo). Os ITENS abaixo são redação original,
 * escritos para seguir a definição de cada faceta oficial. NÃO são o
 * HEXACO-PI-R (Lee & Ashton), cujo uso é restrito a pesquisa acadêmica
 * sem fins lucrativos e proibido em app público — ver README.
 *
 * Chave: k = "p" (positivo) | "r" (reverso, pontua 6 − resposta).
 * n = nível: 1 entra na versão 60, ≤2 na 100, ≤4 na 200.
 */

export type FactorKey = "H" | "E" | "X" | "A" | "C" | "O";
export type Pole = "alto" | "baixo" | "meio";

export interface Factor {
  k: FactorKey;
  ic: "ar" | "chuveiro" | "tv" | "ventilador" | "fogao" | "luz";
  cssVar: string;
  name: string;
  appliance: string;
  regula: string;
  lo: string;
  hi: string;
  anchor: number; // média normativa aproximada (1–5)
  forca: string;
  excesso: string; // sombra da ponta alta
  falta: string; // sombra da ponta baixa
  comAlto: string;
  comBaixo: string;
  short: { p: string; hi: string; lo: string };
}

export const SD = 0.6;

export const FACTORS: Factor[] = [
  {
    k: "H",
    ic: "ar",
    cssVar: "--ac-h",
    name: "Honestidade-Humildade",
    appliance: "Ar-condicionado",
    regula: "o clima do ambiente — justo e respirável para todos, ou abafado",
    lo: "cada um por si",
    hi: "regra igual pra todos",
    anchor: 3.2,
    forca: "Gera confiança, não joga sujo, pacifica, dá o exemplo.",
    excesso:
      "Coopera mesmo sem reciprocidade e pode ser explorado; recusa até a autopromoção legítima e some das decisões.",
    falta:
      "Usa cargo e relação como moeda, se sente acima das regras, mexe no termostato só para si.",
    comAlto:
      "Seja igualmente direto e sem jogo. Reconheça a contribuição dele em público — ele não vai pedir.",
    comBaixo:
      "Não ataque o ego de frente. Prenda o limite a uma regra do sistema, impessoal e igual para todos — nunca a “eu decidi”.",
    short: { p: "confiança e exemplo", hi: "tão “certo” que não se defende", lo: "puxa o cobertor pra si" },
  },
  {
    k: "E",
    ic: "chuveiro",
    cssVar: "--ac-e",
    name: "Emocionalidade",
    appliance: "Chuveiro",
    regula: "a temperatura emocional — para a água não ficar nem gelada, nem fervendo",
    lo: "água fria",
    hi: "água fervendo",
    anchor: 3.4,
    forca: "Percebe risco cedo, cria vínculo profundo, acolhe, chora junto de quem sofre.",
    excesso:
      "Trava no medo de errar, precisa de aprovação constante, leva tudo para o lado pessoal e se esgota.",
    falta:
      "Não se comove visivelmente e pode passar por indiferente; subestima o peso emocional para os outros.",
    comAlto:
      "Dê o roteiro e a previsibilidade antes de cobrar ação. Valide o sentimento antes do conteúdo. Não dê bronca em público.",
    comBaixo:
      "Não espere reação emocional e não a cobre — não é indiferença. Vá direto; para um risco humano, mostre a consequência concreta.",
    short: { p: "acolhe e percebe o risco", hi: "trava no medo, se esgota", lo: "parece indiferente" },
  },
  {
    k: "X",
    ic: "tv",
    cssVar: "--ac-x",
    name: "eXtroversão",
    appliance: "Som da TV",
    regula: "o quanto você ocupa o volume do ambiente",
    lo: "no mudo",
    hi: "no talo",
    anchor: 3.5,
    forca: "Dá energia ao grupo, mobiliza, assume a frente, fala em público sem medo.",
    excesso:
      "Ocupa todo o espaço sem perceber, precisa de plateia, atropela quem é mais quieto, decide no embalo.",
    falta:
      "Não se voluntaria, evita o palco mesmo tendo o que dizer, pode ser lido como desinteresse.",
    comAlto:
      "Dê espaço para a energia no começo, depois feche o tempo (“2 minutos cada”) para os outros entrarem.",
    comBaixo:
      "Pergunte diretamente e dê tempo para responder — silêncio não é concordância. Ofereça o canal escrito.",
    short: { p: "energiza e mobiliza", hi: "não deixa ninguém falar", lo: "some quando devia aparecer" },
  },
  {
    k: "A",
    ic: "ventilador",
    cssVar: "--ac-a",
    name: "Amabilidade",
    appliance: "Ventilador",
    regula: "o clima entre as pessoas — uma brisa que acalma ou um vento que derruba tudo",
    lo: "vendaval",
    hi: "brisa",
    anchor: 2.9,
    forca: "Perdoa, segura o clima, negocia, aguenta pressão sem revidar.",
    excesso:
      "Engole conflito necessário, não bate o pé, terceiriza a decisão, vira “capacho”.",
    falta:
      "Franco a ponto de ferir, pavio curto, guarda mágoa, transforma divergência em disputa pessoal.",
    comAlto:
      "Não confunda a boa vontade com “está tudo bem” — pergunte de novo, específico. Dê permissão explícita para discordar.",
    comBaixo:
      "Nunca debata no calor. Fato, dado, lógica — deixe o número ganhar a discussão. Volte ao ponto quando esfriar.",
    short: { p: "segura o clima, negocia", hi: "vira capacho", lo: "pavio curto, fere" },
  },
  {
    k: "C",
    ic: "fogao",
    cssVar: "--ac-c",
    name: "Conscienciosidade",
    appliance: "Fogo do fogão",
    regula: "o ritmo e o acabamento — ferver rápido ou cozinhar no ponto",
    lo: "fogo apagado",
    hi: "fervendo",
    anchor: 3.4,
    forca: "Estrutura, cumpre prazo, entrega no padrão, previne erro.",
    excesso:
      "Trava a entrega buscando o impecável, burocratiza, não delega porque “ninguém faz certo”.",
    falta:
      "Esquece a panela no fogo ou serve antes de cozinhar — decide no impulso, larga pela metade.",
    comAlto:
      "Combine antes o nível de acabamento aceitável (“isto é rascunho”). Prazo firme. Não mude a regra no meio.",
    comBaixo:
      "Quebre em entregas pequenas e frequentes (48 h), com checagem. Combine lembrete. Registre tudo.",
    short: { p: "organiza e entrega no prazo", hi: "trava buscando o perfeito", lo: "larga pela metade" },
  },
  {
    k: "O",
    ic: "luz",
    cssVar: "--ac-o",
    name: "Abertura à experiência",
    appliance: "Brilho da luz",
    regula: "o quanto você enxerga de novo — clarear ou manter a penumbra do conhecido",
    lo: "penumbra",
    hi: "luz total",
    anchor: 3.4,
    forca: "Resolve problema novo, traz ideia, enxerga além do óbvio, valoriza beleza e sentido.",
    excesso:
      "Troca o que funciona pela novidade só porque é nova, despreza tradição por princípio, dispersa em mil ideias.",
    falta:
      "Engessa no “sempre foi assim”, resiste a qualquer mudança, fecha a porta para o novo.",
    comAlto:
      "Traga o “porquê” e o quadro grande antes do detalhe. Dê espaço para propor — e ajude a aterrissar numa versão executável.",
    comBaixo:
      "Apresente a mudança como evolução segura do que ele já confia. Mostre onde já deu certo. Vá por incremento.",
    short: { p: "traz ideia, enxerga a saída", hi: "novidade por novidade", lo: "engessa no “sempre foi assim”" },
  },
];

export const ALTRUISMO = {
  name: "Altruísmo",
  descAlto: "Generoso, sensível ao sofrimento alheio, disposto a ajudar mesmo sem retorno.",
  descBaixo: "Endurecido diante da dificuldade dos outros, resolve o seu primeiro, dá pouco de si.",
  anchor: 3.9,
};

type Raw = { t: string; k: "p" | "r"; n: 1 | 2 | 3 | 4 };
type FacetBank = { facet: string; items: Raw[] };

/** 8 itens por faceta: n = 1,1,(1),2,(2),3,4,4 conforme a faceta.
 *  60 = n≤1 (sem Altruísmo) · 100 = n≤2 (+Altruísmo) · 200 = n≤4 (+Altruísmo) */
export const BANK: Record<FactorKey, FacetBank[]> = {
  H: [
    { facet: "Sinceridade", items: [
      { t: "Eu não fingiria gostar de alguém apenas para conseguir um favor.", k: "p", n: 1 },
      { t: "Se eu quiser algo de alguém, rio até das piadas piores que a pessoa conta.", k: "r", n: 1 },
      { t: "Sou franco e direto sobre o que eu realmente quero.", k: "p", n: 1 },
      { t: "Não usaria bajulação para conseguir uma promoção ou uma vantagem.", k: "p", n: 2 },
      { t: "Se puxar o saco de alguém importante ajudar, eu puxo.", k: "r", n: 3 },
      { t: "Digo o que penso de verdade, mesmo quando um elogio pegaria melhor.", k: "p", n: 4 },
      { t: "Já inventei um motivo bonito para esconder o meu real interesse.", k: "r", n: 4 },
      { t: "As pessoas sabem que comigo não tem segundas intenções.", k: "p", n: 4 },
    ] },
    { facet: "Justiça", items: [
      { t: "Eu nunca aceitaria um suborno, mesmo que fosse muito grande.", k: "p", n: 1 },
      { t: "Eu seria tentado a usar dinheiro falso se tivesse certeza de que não seria pego.", k: "r", n: 1 },
      { t: "Se eu pudesse, burlaria as regras para me dar bem sem prejudicar ninguém.", k: "r", n: 1 },
      { t: "Se o troco viesse a mais, eu devolveria mesmo sem ninguém perceber.", k: "p", n: 2 },
      { t: "Levar uma pequena vantagem não tem problema quando a empresa é grande.", k: "r", n: 3 },
      { t: "Não pegaria material do trabalho para uso pessoal, nem o mais barato.", k: "p", n: 4 },
      { t: "Se desse para sonegar um pouco sem risco, eu sonegaria.", k: "r", n: 4 },
      { t: "Trato o dinheiro dos outros com o mesmo cuidado que trato o meu.", k: "p", n: 4 },
    ] },
    { facet: "Evitação de ganância", items: [
      { t: "Ter muito dinheiro não é especialmente importante para mim.", k: "p", n: 1 },
      { t: "Gostaria de ter bens luxuosos e caros.", k: "r", n: 1 },
      { t: "Não faço questão de morar num bairro nobre ou de status.", k: "p", n: 2 },
      { t: "Gostaria que as pessoas percebessem quando eu uso algo de marca.", k: "r", n: 2 },
      { t: "Ostentar o que se tem é perda de tempo.", k: "p", n: 3 },
      { t: "Ficaria satisfeito com um padrão de vida simples pelo resto da vida.", k: "p", n: 4 },
      { t: "Ganhar mais que os meus conhecidos me daria uma satisfação especial.", k: "r", n: 4 },
      { t: "Não invejo quem tem carro ou casa melhor que a minha.", k: "p", n: 4 },
    ] },
    { facet: "Modéstia", items: [
      { t: "Eu me considero uma pessoa comum, não melhor do que as outras.", k: "p", n: 1 },
      { t: "Acho que tenho o direito de receber mais respeito do que as pessoas comuns.", k: "r", n: 1 },
      { t: "Não me incomoda dividir o crédito de um trabalho que também foi meu.", k: "p", n: 2 },
      { t: "Pessoas com a minha capacidade merecem um tratamento especial.", k: "r", n: 2 },
      { t: "Me sentiria desconfortável sendo tratado como alguém importante.", k: "p", n: 3 },
      { t: "Fico sem graça quando me elogiam na frente dos outros.", k: "p", n: 4 },
      { t: "Costumo lembrar às pessoas do que eu já fiz por elas.", k: "r", n: 4 },
      { t: "Não me acho mais capaz do que a maioria das pessoas que conheço.", k: "p", n: 4 },
    ] },
  ],
  E: [
    { facet: "Medo", items: [
      { t: "Eu evitaria atividades que envolvam risco de dano físico.", k: "p", n: 1 },
      { t: "Eu não tenho medo de pular de paraquedas ou fazer esportes radicais.", k: "r", n: 1 },
      { t: "A ideia de caminhar no escuro não me assusta.", k: "r", n: 1 },
      { t: "Sinto um aperto só de pensar em me machucar.", k: "p", n: 2 },
      { t: "Situações fisicamente perigosas até me atraem.", k: "r", n: 3 },
      { t: "Fico tenso em lugares altos ou em estradas perigosas.", k: "p", n: 4 },
      { t: "Encaro sem hesitar uma situação que assustaria a maioria.", k: "r", n: 4 },
      { t: "Evito o que pode dar errado fisicamente, mesmo com chance pequena.", k: "p", n: 4 },
    ] },
    { facet: "Ansiedade", items: [
      { t: "Eu me preocupo muito com coisas sem importância.", k: "p", n: 1 },
      { t: "Eu raramente me preocupo com o que vai acontecer amanhã.", k: "r", n: 1 },
      { t: "Sinto um frio na barriga sempre que tenho que tomar uma decisão.", k: "p", n: 1 },
      { t: "Fico remoendo um problema por dias antes de conseguir soltar.", k: "p", n: 2 },
      { t: "Costumo manter a cabeça tranquila mesmo quando as coisas apertam.", k: "r", n: 3 },
      { t: "Um problema pequeno já tira o meu sono.", k: "p", n: 4 },
      { t: "Deixo as preocupações de lado quando não há nada a fazer no momento.", k: "r", n: 4 },
      { t: "Costumo imaginar o pior antes de saber como as coisas vão ficar.", k: "p", n: 4 },
    ] },
    { facet: "Dependência", items: [
      { t: "Quando sofro, sinto uma forte necessidade de falar com alguém.", k: "p", n: 1 },
      { t: "Eu consigo lidar com problemas difíceis sem precisar de apoio emocional.", k: "r", n: 1 },
      { t: "Nos momentos difíceis, preciso que alguém me diga que vai dar tudo certo.", k: "p", n: 2 },
      { t: "Resolvo minhas crises sozinho, sem desabafar com ninguém.", k: "r", n: 2 },
      { t: "Buscar um colo quando estou mal é a primeira coisa que faço.", k: "p", n: 3 },
      { t: "Aguento mais quando sei que tem alguém do meu lado.", k: "p", n: 4 },
      { t: "Não costumo procurar ninguém quando estou passando por algo difícil.", k: "r", n: 4 },
      { t: "Uma palavra de incentivo muda completamente o meu dia.", k: "p", n: 4 },
    ] },
    { facet: "Sentimentalismo", items: [
      { t: "Eu sinto uma forte emoção quando alguém se despede por muito tempo.", k: "p", n: 1 },
      { t: "Eu raramente choro, mesmo quando vejo pessoas sofrendo.", k: "r", n: 1 },
      { t: "Me emociono fácil com as histórias das outras pessoas.", k: "p", n: 2 },
      { t: "Cenas tristes em filmes não me abalam.", k: "r", n: 2 },
      { t: "Sinto no corpo a dor de quem eu amo.", k: "p", n: 3 },
      { t: "Me pego pensando em alguém que está passando por um momento ruim.", k: "p", n: 4 },
      { t: "Notícias tristes de desconhecidos não me afetam muito.", k: "r", n: 4 },
      { t: "Fico com um nó na garganta em despedidas e reencontros.", k: "p", n: 4 },
    ] },
  ],
  X: [
    { facet: "Autoestima social", items: [
      { t: "Eu me sinto confortável ao conhecer pessoas novas.", k: "p", n: 1 },
      { t: "Eu costumo me achar inferior quando estou em grandes grupos.", k: "r", n: 1 },
      { t: "Eu sei que as pessoas geralmente gostam de mim.", k: "p", n: 1 },
      { t: "No geral, estou satisfeito comigo mesmo.", k: "p", n: 2 },
      { t: "Costumo me sentir um peso para o grupo.", k: "r", n: 3 },
      { t: "Me sinto à vontade sendo eu mesmo perto de qualquer pessoa.", k: "p", n: 4 },
      { t: "Costumo achar que os outros me acham chato ou sem graça.", k: "r", n: 4 },
      { t: "No fim das contas, gosto de quem eu sou.", k: "p", n: 4 },
    ] },
    { facet: "Ousadia social", items: [
      { t: "Em uma reunião, geralmente sou o primeiro a falar.", k: "p", n: 1 },
      { t: "Eu prefiro ficar quieto e não chamar a atenção para mim.", k: "r", n: 1 },
      { t: "Puxo conversa com um desconhecido sem dificuldade.", k: "p", n: 2 },
      { t: "Evito assumir a palavra na frente de um grupo.", k: "r", n: 2 },
      { t: "Gosto de estar no comando quando o grupo trava.", k: "p", n: 3 },
      { t: "Não tenho problema em discordar de alguém em público.", k: "p", n: 4 },
      { t: "Fico esperando outra pessoa tomar a iniciativa.", k: "r", n: 4 },
      { t: "Me ofereço para apresentar ou conduzir quando ninguém quer.", k: "p", n: 4 },
    ] },
    { facet: "Sociabilidade", items: [
      { t: "Aproveito muito as conversas e a interação com muita gente.", k: "p", n: 1 },
      { t: "Eu prefiro passar a maior parte do meu tempo sozinho.", k: "r", n: 1 },
      { t: "Evito ir a festas ou grandes reuniões sociais.", k: "r", n: 1 },
      { t: "Um fim de semana cheio de gente me anima, não me cansa.", k: "p", n: 2 },
      { t: "Prefiro um grupo pequeno e conhecido a um evento grande.", k: "r", n: 3 },
      { t: "Sinto falta de gente quando passo muito tempo sozinho.", k: "p", n: 4 },
      { t: "Recuso convites quando poderia simplesmente ficar em casa.", k: "r", n: 4 },
      { t: "Gosto de encher a casa de visita.", k: "p", n: 4 },
    ] },
    { facet: "Vivacidade", items: [
      { t: "Na maioria dos dias, sinto-me alegre e cheio de energia.", k: "p", n: 1 },
      { t: "As pessoas costumam dizer que eu tenho pouca energia ou sou desanimado.", k: "r", n: 1 },
      { t: "Costumo ser o ânimo do grupo quando a energia cai.", k: "p", n: 2 },
      { t: "Levo a maior parte do dia num ritmo devagar e sem empolgação.", k: "r", n: 2 },
      { t: "Acordo com vontade de que o dia comece logo.", k: "p", n: 3 },
      { t: "Costumo estar de bom humor sem um motivo específico.", k: "p", n: 4 },
      { t: "Me falta pique para levar o dia adiante.", k: "r", n: 4 },
      { t: "As pessoas se contagiam com a minha empolgação.", k: "p", n: 4 },
    ] },
  ],
  A: [
    { facet: "Capacidade de perdoar", items: [
      { t: "Raramente guardo rancor, mesmo daqueles que me ofenderam.", k: "p", n: 1 },
      { t: "Minha atitude é “olho por olho, dente por dente”.", k: "r", n: 1 },
      { t: "Acho fácil dar uma segunda chance a quem falhou comigo.", k: "p", n: 1 },
      { t: "Depois de uma briga, retomo a relação sem ficar remoendo.", k: "p", n: 2 },
      { t: "Quando alguém me magoa, demoro muito para voltar a confiar.", k: "r", n: 3 },
      { t: "Consigo trabalhar bem com alguém que já me decepcionou.", k: "p", n: 4 },
      { t: "Quando me traem, corto a relação de vez.", k: "r", n: 4 },
      { t: "Não fico lembrando erros antigos numa discussão nova.", k: "p", n: 4 },
    ] },
    { facet: "Gentileza", items: [
      { t: "As pessoas me veem como alguém de coração mole.", k: "p", n: 1 },
      { t: "Muitas vezes critico as pessoas de forma dura quando elas erram.", k: "r", n: 1 },
      { t: "Costumo julgar os erros dos outros com leniência.", k: "p", n: 2 },
      { t: "Falo poucas e boas quando alguém pisa na bola.", k: "r", n: 2 },
      { t: "Prefiro apontar o acerto antes de apontar a falha.", k: "p", n: 3 },
      { t: "Dou o benefício da dúvida antes de concluir que alguém agiu mal.", k: "p", n: 4 },
      { t: "Sou implacável quando alguém não faz a parte dele.", k: "r", n: 4 },
      { t: "Prefiro corrigir em particular e com jeito.", k: "p", n: 4 },
    ] },
    { facet: "Flexibilidade", items: [
      { t: "Costumo ceder para evitar brigas, mesmo quando estou certo.", k: "p", n: 1 },
      { t: "Eu insisto ferozmente na minha opinião, não importando o conflito.", k: "r", n: 1 },
      { t: "Topo mudar o meu plano para acomodar o do grupo.", k: "p", n: 2 },
      { t: "Dificilmente abro mão do meu jeito de fazer as coisas.", k: "r", n: 2 },
      { t: "Num impasse, sou eu quem oferece o meio-termo.", k: "p", n: 3 },
      { t: "Aceito bem quando decidem diferente do que eu queria.", k: "p", n: 4 },
      { t: "Discuto até a pessoa aceitar o meu ponto de vista.", k: "r", n: 4 },
      { t: "Procuro o que dá para combinar em vez do que separa.", k: "p", n: 4 },
    ] },
    { facet: "Paciência", items: [
      { t: "Consigo manter a calma facilmente, mesmo com pessoas difíceis.", k: "p", n: 1 },
      { t: "Eu perco a paciência rapidamente quando as pessoas me irritam.", k: "r", n: 1 },
      { t: "Fico com raiva rapidamente se alguém me corta no trânsito.", k: "r", n: 1 },
      { t: "Raramente levanto a voz, mesmo contrariado.", k: "p", n: 2 },
      { t: "Fico irritado rápido quando as coisas não saem como planejei.", k: "r", n: 3 },
      { t: "Demoro muito para ficar realmente bravo.", k: "p", n: 4 },
      { t: "Exploro com facilidade quando me contrariam várias vezes.", k: "r", n: 4 },
      { t: "Consigo respirar e responder com calma no meio de uma bronca.", k: "p", n: 4 },
    ] },
  ],
  C: [
    { facet: "Organização", items: [
      { t: "Gosto de manter a minha mesa e o meu ambiente sempre arrumados.", k: "p", n: 1 },
      { t: "Geralmente deixo as coisas espalhadas sem me preocupar.", k: "r", n: 1 },
      { t: "Não perco tempo planejando; eu apenas começo a fazer.", k: "r", n: 1 },
      { t: "Antes de começar, separo tudo o que vou precisar.", k: "p", n: 2 },
      { t: "Perco tempo procurando coisas que guardei em qualquer lugar.", k: "r", n: 3 },
      { t: "Tenho um lugar para cada coisa e mantenho assim.", k: "p", n: 4 },
      { t: "A minha bagunça só eu entendo — e às vezes nem eu.", k: "r", n: 4 },
      { t: "Faço uma lista antes de começar um trabalho grande.", k: "p", n: 4 },
    ] },
    { facet: "Diligência", items: [
      { t: "Trabalho duro para alcançar os meus objetivos.", k: "p", n: 1 },
      { t: "Costumo fazer apenas o mínimo necessário para cumprir a tarefa.", k: "r", n: 1 },
      { t: "Sou conhecido por ser extremamente disciplinado.", k: "p", n: 1 },
      { t: "Quando começo algo, vou até o fim mesmo sem vontade.", k: "p", n: 2 },
      { t: "Largo as tarefas na metade quando elas ficam chatas.", k: "r", n: 3 },
      { t: "Cumpro o que prometo mesmo quando ninguém está cobrando.", k: "p", n: 4 },
      { t: "Adio tarefas até o prazo estourar.", k: "r", n: 4 },
      { t: "Me esforço além do combinado quando o resultado importa.", k: "p", n: 4 },
    ] },
    { facet: "Perfeccionismo", items: [
      { t: "Verifico minuciosamente os detalhes de um documento antes de enviar.", k: "p", n: 1 },
      { t: "Cometo pequenos erros com frequência porque não reviso o meu trabalho.", k: "r", n: 1 },
      { t: "Reviso um trabalho várias vezes até não achar nenhuma falha.", k: "p", n: 2 },
      { t: "Entrego as coisas sem conferir se está tudo certo.", k: "r", n: 2 },
      { t: "Pequenos detalhes fora do lugar me incomodam até eu ajustar.", k: "p", n: 3 },
      { t: "Não sossego enquanto não está do jeito certo.", k: "p", n: 4 },
      { t: "Passa despercebido para mim se um número ou nome está errado.", k: "r", n: 4 },
      { t: "Confiro duas vezes antes de dar algo por pronto.", k: "p", n: 4 },
    ] },
    { facet: "Prudência", items: [
      { t: "Penso muito antes de decidir, avaliando todas as consequências.", k: "p", n: 1 },
      { t: "Frequentemente ajo por impulso e decido no calor do momento.", k: "r", n: 1 },
      { t: "Evito decidir na hora; prefiro dormir sobre o assunto.", k: "p", n: 2 },
      { t: "Costumo me arrepender de coisas que falei ou fiz sem pensar.", k: "r", n: 2 },
      { t: "Peso os prós e os contras até de escolhas pequenas.", k: "p", n: 3 },
      { t: "Raramente compro ou decido algo grande na hora.", k: "p", n: 4 },
      { t: "Costumo falar antes de medir as consequências.", k: "r", n: 4 },
      { t: "Seguro a resposta quando estou com raiva para não me arrepender.", k: "p", n: 4 },
    ] },
  ],
  O: [
    { facet: "Apreciação estética", items: [
      { t: "Fico profundamente comovido diante de uma bela obra de arte.", k: "p", n: 1 },
      { t: "Não me importo com a decoração ou com a estética visual dos lugares.", k: "r", n: 1 },
      { t: "Sinto-me inspirado ao observar paisagens na natureza.", k: "p", n: 1 },
      { t: "Faço questão de parar para apreciar algo bonito.", k: "p", n: 2 },
      { t: "Museus e exposições não me dizem muita coisa.", k: "r", n: 3 },
      { t: "Uma música bem feita me arrepia.", k: "p", n: 4 },
      { t: "Ambiente bonito ou feio dá no mesmo para mim.", k: "r", n: 4 },
      { t: "Reparo em detalhes de arquitetura e design por onde passo.", k: "p", n: 4 },
    ] },
    { facet: "Curiosidade", items: [
      { t: "Tenho muito interesse em ler sobre história e ciência.", k: "p", n: 1 },
      { t: "Acho debater teorias filosóficas algo inútil e entediante.", k: "r", n: 1 },
      { t: "Não tenho curiosidade em saber como o universo funciona.", k: "r", n: 1 },
      { t: "Gosto de aprender sobre assuntos sem utilidade prática imediata.", k: "p", n: 2 },
      { t: "Faço perguntas sobre coisas que a maioria acha óbvias.", k: "p", n: 3 },
      { t: "Vou atrás de entender como as coisas funcionam por dentro.", k: "p", n: 4 },
      { t: "Assunto que não resolve nada na prática não me interessa.", k: "r", n: 4 },
      { t: "Gosto de conversas que me fazem pensar diferente.", k: "p", n: 4 },
    ] },
    { facet: "Criatividade", items: [
      { t: "Gosto de propor ideias que mudam completamente a forma de fazer as coisas.", k: "p", n: 1 },
      { t: "Prefiro executar processos existentes a inventar coisas novas.", k: "r", n: 1 },
      { t: "Costumo enxergar uma solução que ninguém tinha pensado.", k: "p", n: 2 },
      { t: "Não me vejo como uma pessoa criativa.", k: "r", n: 2 },
      { t: "Gosto de improvisar em vez de seguir um modelo pronto.", k: "p", n: 3 },
      { t: "Junto ideias de lugares diferentes para resolver um problema.", k: "p", n: 4 },
      { t: "Fico travado quando não tem um passo a passo pronto.", k: "r", n: 4 },
      { t: "Gosto de dar um jeito novo em algo que todo mundo faz igual.", k: "p", n: 4 },
    ] },
    { facet: "Não-convencionalidade", items: [
      { t: "Acho que as pessoas deveriam questionar abertamente as ideias estabelecidas.", k: "p", n: 1 },
      { t: "As velhas tradições sempre devem ser mantidas.", k: "r", n: 1 },
      { t: "Gosto de pessoas que têm ideias fora do comum.", k: "p", n: 2 },
      { t: "Fico desconfortável perto de quem pensa muito diferente de mim.", k: "r", n: 2 },
      { t: "Não me importo de ser visto como alguém excêntrico.", k: "p", n: 3 },
      { t: "Não sigo uma regra só porque sempre foi assim.", k: "p", n: 4 },
      { t: "Prefiro conviver com quem pensa parecido comigo.", k: "r", n: 4 },
      { t: "Ideias que incomodam a maioria costumam me atrair.", k: "p", n: 4 },
    ] },
  ],
};

/** Escala interpessoal Altruísmo (entra só na 100 e na 200). */
export const ALT_ITEMS: Raw[] = [
  { t: "Fico feliz em ajudar alguém mesmo quando não vou ganhar nada com isso.", k: "p", n: 1 },
  { t: "As pessoas dizem que eu tenho um coração generoso.", k: "p", n: 1 },
  { t: "Sinto pena de quem está em dificuldade e faço algo a respeito.", k: "p", n: 2 },
  { t: "Não é problema meu se alguém se dá mal por conta própria.", k: "r", n: 2 },
  { t: "Divido o que tenho com quem precisa, mesmo que me falte um pouco.", k: "p", n: 3 },
  { t: "Passaria por cima de alguém para conseguir o que quero.", k: "r", n: 4 },
  { t: "Me incomoda ver qualquer pessoa sofrendo, mesmo um desconhecido.", k: "p", n: 4 },
  { t: "Ser gentil com estranhos é gastar energia à toa.", k: "r", n: 4 },
];

export type Versao = 60 | 100 | 200;
export interface VersaoInfo {
  n: Versao;
  label: string;
  min: string;
  altruismo: boolean;
  qualidade: string;
}
export const VERSOES: Record<Versao, VersaoInfo> = {
  60: { n: 60, label: "Rápido", min: "10", altruismo: false, qualidade: "Suficiente para um retrato confiável e para a palestra." },
  100: { n: 100, label: "Aprofundado", min: "20", altruismo: true, qualidade: "Itens de reforço por faceta + escala de Altruísmo. Boa nuance." },
  200: { n: 200, label: "Excelente", min: "30", altruismo: true, qualidade: "Resolução máxima — o retrato mais fiel de cada faceta." },
};

const maxTier: Record<Versao, 1 | 2 | 4> = { 60: 1, 100: 2, 200: 4 };

export interface Item {
  f: FactorKey | "ALT";
  facet: string;
  k: "p" | "r";
  t: string;
}

/** Monta a lista de itens da versão, intercalando os fatores (menos “bloco de honestidade”). */
export function buildItems(versao: Versao): Item[] {
  const tier = maxTier[versao];
  const perFactor: Item[][] = FACTORS.map((f) => {
    const arr: Item[] = [];
    BANK[f.k].forEach((fac) => {
      fac.items.forEach((it) => {
        if (it.n <= tier) arr.push({ f: f.k, facet: fac.facet, k: it.k, t: it.t });
      });
    });
    return arr;
  });
  const max = Math.max(...perFactor.map((a) => a.length));
  const out: Item[] = [];
  for (let r = 0; r < max; r++) for (let i = 0; i < 6; i++) if (perFactor[i][r]) out.push(perFactor[i][r]);

  if (VERSOES[versao].altruismo) {
    const alt = ALT_ITEMS.filter((it) => it.n <= tier).map<Item>((it) => ({ f: "ALT", facet: "Altruísmo", k: it.k, t: it.t }));
    // espalha os itens de altruísmo uniformemente
    const step = Math.max(1, Math.floor(out.length / (alt.length + 1)));
    alt.forEach((it, i) => out.splice(Math.min(out.length, (i + 1) * step + i), 0, it));
  }
  return out;
}

export interface FactorScore {
  f: Factor;
  mean: number;
  z: number;
  pole: Pole;
}
export interface Resultado {
  fatores: FactorScore[];
  altruismo: number | null;
  versao: Versao;
}

export function pontuar(items: Item[], respostas: (number | null)[], versao: Versao): Resultado {
  const val = (it: Item, r: number) => (it.k === "r" ? 6 - r : r);
  const fatores: FactorScore[] = FACTORS.map((f) => {
    const vs: number[] = [];
    items.forEach((it, i) => {
      if (it.f === f.k && respostas[i] != null) vs.push(val(it, respostas[i] as number));
    });
    const mean = vs.reduce((a, b) => a + b, 0) / vs.length;
    const z = (mean - f.anchor) / SD;
    const pole: Pole = z >= 0.5 ? "alto" : z <= -0.5 ? "baixo" : "meio";
    return { f, mean, z, pole };
  });
  let altruismo: number | null = null;
  if (VERSOES[versao].altruismo) {
    const vs: number[] = [];
    items.forEach((it, i) => {
      if (it.f === "ALT" && respostas[i] != null) vs.push(val(it, respostas[i] as number));
    });
    if (vs.length) altruismo = vs.reduce((a, b) => a + b, 0) / vs.length;
  }
  return { fatores, altruismo, versao };
}

export function faixaLabel(z: number): string {
  if (z <= -1.5) return "bem abaixo";
  if (z <= -0.5) return "abaixo";
  if (z < 0.5) return "no meio-termo";
  if (z < 1.5) return "acima";
  return "bem acima";
}

/** posição 0–100 no trilho a partir da média 1–5 */
export function posPct(mean: number): number {
  return Math.max(4, Math.min(96, ((mean - 1) / 4) * 100));
}
