
export class FiltroRelatorioAtendimento {

    public atendimentoDataInicial: string
    public atendimentoDataFinal: string
    public atendminetoNomePaciente: string
    public atendimentoNomeFisioterapeuta: string

    constructor(atendimentoDataInicial: string, atendimentoDataFinal: string, atendminetoNomePaciente:string , atendimentoNomeFisioterapeuta: string) {
        this.atendimentoDataInicial = atendimentoDataInicial;
        this.atendimentoDataFinal = atendimentoDataFinal;
        this.atendminetoNomePaciente = atendminetoNomePaciente;
        this.atendimentoNomeFisioterapeuta = atendimentoNomeFisioterapeuta;
    }
}