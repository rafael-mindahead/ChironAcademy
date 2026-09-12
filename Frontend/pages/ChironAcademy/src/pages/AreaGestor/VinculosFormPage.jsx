import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    listarOpcoes,
    listarVinculos,
    criarVinculo,
    excluirVinculo
} from '../../services/gestorServices/vinculosFormService'

const vazio = {
    idProfessor: '',
    idTurma: '',
    codDisciplina: ''
}

export default function VinculosFormPage() {
    const navigate = useNavigate()

    const [formulario, setFormulario] = useState(vazio)

    const [professores, setProfessores] = useState([])
    const [turmas, setTurmas] = useState([])
    const [disciplinas, setDisciplinas] = useState([])
    const [vinculos, setVinculos] = useState([])

    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    const [vinculoParaExcluir, setVinculoParaExcluir] = useState(null)

    const [toast, setToast] = useState({
        visivel: false,
        mensagem: '',
        tipo: 'sucesso'
    })

    const mostrarToast = (mensagem, tipo = 'sucesso') => {
        setToast({
            visivel: true,
            mensagem,
            tipo
        })

        setTimeout(() => {
            setToast({
                visivel: false,
                mensagem: '',
                tipo: 'sucesso'
            })
        }, 3000)
    }

    const carregarDados = async () => {
        try {
            setCarregando(true)

            const [opcoes, dadosVinculos] = await Promise.all([
                listarOpcoes(),
                listarVinculos()
            ])

            setProfessores(opcoes.professores || [])
            setTurmas(opcoes.turmas || [])
            setDisciplinas(opcoes.disciplinas || [])
            setVinculos(dadosVinculos.vinculos || [])
        } catch (error) {
            mostrarToast(
                error.message || 'Erro ao carregar os dados.',
                'erro'
            )
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarDados()
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }))
    }

    const handleRedefinir = () => {
        setFormulario(vazio)
    }

    const handleCadastrar = async (event) => {
        event.preventDefault()

        if (
            !formulario.idProfessor ||
            !formulario.idTurma ||
            !formulario.codDisciplina
        ) {
            mostrarToast(
                'Professor, turma e disciplina são obrigatórios.',
                'erro'
            )
            return
        }

        try {
            setSalvando(true)

            await criarVinculo({
                idProfessor: Number(formulario.idProfessor),
                idTurma: Number(formulario.idTurma),
                codDisciplina: formulario.codDisciplina
            })

            mostrarToast('Vínculo criado com sucesso.')

            setFormulario(vazio)

            const dadosAtualizados = await listarVinculos()
            setVinculos(dadosAtualizados.vinculos || [])
        } catch (error) {
            mostrarToast(
                error.message || 'Erro ao criar vínculo.',
                'erro'
            )
        } finally {
            setSalvando(false)
        }
    }

    const handleExcluir = async () => {
        if (!vinculoParaExcluir) return

        try {
            await excluirVinculo(
                vinculoParaExcluir.idProfessorTurma
            )

            mostrarToast('Vínculo excluído com sucesso.')

            setVinculoParaExcluir(null)

            const dadosAtualizados = await listarVinculos()
            setVinculos(dadosAtualizados.vinculos || [])
        } catch (error) {
            mostrarToast(
                error.message || 'Erro ao excluir vínculo.',
                'erro'
            )
        }
    }

    const formatarTurno = (turno) => {
        const turnos = {
            MANHA: 'Manhã',
            TARDE: 'Tarde',
            NOITE: 'Noite'
        }

        return turnos[turno] || turno
    }

    return (
        <div className="min-h-screen bg-background px-6 py-10 lg:px-10">
            <div className="mx-auto max-w-7xl">

                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Vínculos
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Vincule professores a turmas e disciplinas.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/sistema/gestor')}
                        className="text-sm font-medium text-foreground transition-opacity hover:opacity-70"
                    >
                        ← Voltar ao menu
                    </button>
                </div>

                <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground">
                            Criar vínculo
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Selecione o professor, a turma e a disciplina.
                        </p>
                    </div>

                    <form onSubmit={handleCadastrar}>
                        <div className="grid gap-5 md:grid-cols-3">

                            <div>
                                <label
                                    htmlFor="idProfessor"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Professor
                                </label>

                                <select
                                    id="idProfessor"
                                    name="idProfessor"
                                    value={formulario.idProfessor}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">
                                        Selecione um professor
                                    </option>

                                    {professores.map((professor) => (
                                        <option
                                            key={professor.idProfessor}
                                            value={professor.idProfessor}
                                        >
                                            {professor.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="idTurma"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Turma
                                </label>

                                <select
                                    id="idTurma"
                                    name="idTurma"
                                    value={formulario.idTurma}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">
                                        Selecione uma turma
                                    </option>

                                    {turmas.map((turma) => (
                                        <option
                                            key={turma.idTurma}
                                            value={turma.idTurma}
                                        >
                                            {turma.localTurma} — {formatarTurno(turma.turnoTurma)} — {turma.nomeCurso}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="codDisciplina"
                                    className="mb-2 block text-sm font-medium text-foreground"
                                >
                                    Disciplina
                                </label>

                                <select
                                    id="codDisciplina"
                                    name="codDisciplina"
                                    value={formulario.codDisciplina}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">
                                        Selecione uma disciplina
                                    </option>

                                    {disciplinas.map((disciplina) => (
                                        <option
                                            key={disciplina.codDisciplina}
                                            value={disciplina.codDisciplina}
                                        >
                                            {disciplina.nomeDisciplina} ({disciplina.codDisciplina})
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="mt-6 flex items-center justify-end gap-4 border-t border-border pt-5">
                            <button
                                type="button"
                                onClick={handleRedefinir}
                                className="text-sm font-medium text-muted-foreground transition-opacity hover:opacity-70"
                            >
                                Redefinir
                            </button>

                            <button
                                type="submit"
                                disabled={salvando}
                                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {salvando ? 'Cadastrando...' : 'Criar vínculo'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground">
                            Vínculos cadastrados
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Consulte e remova os vínculos existentes.
                        </p>
                    </div>

                    {carregando ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Carregando...
                        </p>
                    ) : vinculos.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Nenhum vínculo cadastrado.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Professor
                                        </th>

                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Turma
                                        </th>

                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Disciplina
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {vinculos.map((vinculo) => (
                                        <tr
                                            key={vinculo.idProfessorTurma}
                                            className="border-b border-border last:border-0"
                                        >
                                            <td className="px-4 py-4 font-medium text-foreground">
                                                {vinculo.nomeProfessor}
                                            </td>

                                            <td className="px-4 py-4 text-muted-foreground">
                                                {vinculo.localTurma}
                                                {' — '}
                                                {formatarTurno(vinculo.turnoTurma)}
                                            </td>

                                            <td className="px-4 py-4 text-muted-foreground">
                                                {vinculo.nomeDisciplina}
                                                {' ('}
                                                {vinculo.codDisciplina}
                                                {')'}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setVinculoParaExcluir(vinculo)
                                                    }
                                                    className="text-sm font-medium text-destructive transition-opacity hover:opacity-70"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {vinculoParaExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-foreground">
                            Excluir vínculo
                        </h2>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Tem certeza que deseja excluir este vínculo?
                        </p>

                        <div className="mt-4 rounded-lg bg-background p-4 text-sm">
                            <p className="font-medium text-foreground">
                                {vinculoParaExcluir.nomeProfessor}
                            </p>

                            <p className="mt-1 text-muted-foreground">
                                {vinculoParaExcluir.nomeDisciplina}
                            </p>

                            <p className="mt-1 text-muted-foreground">
                                {vinculoParaExcluir.localTurma}
                                {' — '}
                                {formatarTurno(vinculoParaExcluir.turnoTurma)}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setVinculoParaExcluir(null)}
                                className="text-sm font-medium text-muted-foreground transition-opacity hover:opacity-70"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleExcluir}
                                className="text-sm font-medium text-destructive transition-opacity hover:opacity-70"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.visivel && (
                <div
                    className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-border bg-card px-5 py-4 text-sm shadow-lg ${
                        toast.tipo === 'erro'
                            ? 'border-l-4 border-l-destructive'
                            : 'border-l-4 border-l-primary'
                    }`}
                >
                    {toast.mensagem}
                </div>
            )}
        </div>
    )
}