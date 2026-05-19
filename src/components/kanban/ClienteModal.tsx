import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatarData } from "@/lib/formatters";
import type { Cliente } from "@/types/kanban";

interface ClienteModalProps {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
  onSalvar: (
    payload: {
      nome: string;
      telefone: string;
      responsavel: string;
      tags: string[];
      obs: string;
    },
    novasInteracoes: string[],
    editId?: string
  ) => Promise<void>;
}

export function ClienteModal({
  open,
  cliente,
  onClose,
  onSalvar,
}: ClienteModalProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [tags, setTags] = useState("");
  const [obs, setObs] = useState("");
  const [novaInteracao, setNovaInteracao] = useState("");
  const [novasInteracoes, setNovasInteracoes] = useState<string[]>([]);
  const [interacoesExibidas, setInteracoesExibidas] = useState<
    { texto: string; data: Date | string; isNova?: boolean }[]
  >([]);
  const [salvando, setSalvando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setNome(cliente?.nome ?? "");
      setTelefone(cliente?.telefone ?? "");
      setResponsavel(cliente?.responsavel ?? "");
      setTags((cliente?.tags ?? []).join(", "));
      setObs(cliente?.obs ?? "");
      setNovaInteracao("");
      setNovasInteracoes([]);
      setInteracoesExibidas(
        (cliente?.historico ?? [])
          .sort(
            (a, b) =>
              new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime()
          )
          .map((h) => ({ texto: h.texto, data: h.criado_em }))
      );
    }
  }, [open, cliente]);

  // Auto-scroll histórico
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [interacoesExibidas]);

  function adicionarInteracao() {
    const texto = novaInteracao.trim();
    if (!texto) return;
    setNovasInteracoes((prev) => [...prev, texto]);
    setInteracoesExibidas((prev) => [
      ...prev,
      { texto, data: new Date(), isNova: true },
    ]);
    setNovaInteracao("");
  }

  async function handleSalvar() {
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      await onSalvar(
        {
          nome: nome.trim(),
          telefone: telefone.trim(),
          responsavel: responsavel.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          obs: obs.trim(),
        },
        novasInteracoes,
        cliente?.id
      );
      onClose();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label>Nome *</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-1">
              <Label>Responsável</Label>
              <Input
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Nome do vendedor"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ex: VIP, urgente"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Observações</Label>
              <Textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Notas internas..."
                rows={2}
              />
            </div>
          </div>

          {/* Histórico */}
          <div>
            <Label className="text-sm font-semibold">Histórico</Label>

            <ScrollArea className="h-48 mt-2 rounded-md border bg-gray-50 p-2">
              <div ref={scrollRef} className="space-y-2">
                {interacoesExibidas.map((item, i) => (
                  <div key={i} className="flex flex-col items-start">
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[85%] shadow-sm ${
                        item.isNova
                          ? "bg-blue-100 border border-blue-200"
                          : "bg-white"
                      }`}
                    >
                      <p className="text-sm text-gray-800">{item.texto}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                        {formatarData(item.data as string)}
                      </p>
                    </div>
                  </div>
                ))}
                {interacoesExibidas.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">
                    Nenhuma interação ainda
                  </p>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-2">
              <Input
                value={novaInteracao}
                onChange={(e) => setNovaInteracao(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && adicionarInteracao()}
                placeholder="Digite uma interação..."
                className="text-sm"
              />
              <Button
                type="button"
                onClick={adicionarInteracao}
                size="sm"
                className="shrink-0"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={salvando}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={salvando || !nome.trim()}>
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
