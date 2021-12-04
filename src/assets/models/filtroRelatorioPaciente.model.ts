
export class FiltroRelatorioPaciente {

    public pacienteDataNascimentoInicial: string
    public pacienteDataNascimentoFinal: string
    public pacienteDataCadastroInicial: string
    public pacienteDataCadastroFinal: string
    public pacienteNome: string
    public pacienteCpf: string

    constructor(pacienteDataNascimentoInicial: string, pacienteDataNascimentoFinal: string, pacienteDataCadastroInicial: string, pacienteDataCadastroFinal: string, pacienteNome: string, pacienteCpf: string) {
        this.pacienteDataNascimentoInicial = pacienteDataNascimentoInicial;
        this.pacienteDataNascimentoFinal = pacienteDataNascimentoFinal;
        this.pacienteDataCadastroInicial = pacienteDataCadastroInicial;
        this.pacienteDataCadastroFinal = pacienteDataCadastroFinal;
        this.pacienteNome = pacienteNome;
        this.pacienteCpf = pacienteCpf;
    }
}