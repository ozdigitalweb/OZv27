import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Server,
  Play,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Terminal,
  Trash2,
  Shield,
  Clock,
  FileCode2,
  Activity
} from 'lucide-react';
import { blogApi } from '../services/api';

interface N8nConfig {
  enabled: boolean;
  webhookUrl: string;
  authHeaderName: string;
  authHeaderValue: string;
  timeoutMs: number;
  fallbackToLocalFunnel: boolean;
  updatedAt: string;
}

interface N8nDispatchLog {
  id: string;
  event: string;
  webhookUrl: string;
  sessionId: string;
  step: string;
  engine: 'n8n-vps' | 'local-funnel-fallback' | 'test-ping';
  status: 'success' | 'error';
  httpStatus?: number;
  latencyMs: number;
  errorMessage?: string;
  payloadPreview: string;
  executedAt: string;
}

interface N8nConsultantManagerProps {
  onShowToast?: (type: 'success' | 'error', message: string) => void;
}

const VPS_FILES = [
  { id: 'install-vps.sh', label: 'install-vps.sh', desc: 'Instalador Automático VPS (Docker + Compose)' },
  { id: 'docker-compose.yml', label: 'docker-compose.yml', desc: 'Stack n8n + PostgreSQL 16 (Porta 5678)' },
  { id: 'oz-consultor-workflow.json', label: 'oz-consultor-workflow.json', desc: 'Fluxo do Consultor Virtual para Importar' },
  { id: 'README.md', label: 'README.md', desc: 'Guia de Instalação Local na VPS' }
] as const;

export default function N8nConsultantManager({ onShowToast }: N8nConsultantManagerProps) {
  const [config, setConfig] = useState<N8nConfig>({
    enabled: true,
    webhookUrl: 'http://localhost:5678/webhook/oz-consultor',
    authHeaderName: 'X-OZ-Webhook-Secret',
    authHeaderValue: '',
    timeoutMs: 8000,
    fallbackToLocalFunnel: true,
    updatedAt: ''
  });
  const [logs, setLogs] = useState<N8nDispatchLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    httpStatus?: number;
    latencyMs?: number;
    error?: string;
    response?: any;
  } | null>(null);

  const [selectedFile, setSelectedFile] = useState<string>('install-vps.sh');
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const notify = (type: 'success' | 'error', msg: string) => {
    if (onShowToast) onShowToast(type, msg);
  };

  const getAuthHeaders = (): HeadersInit => {
    const token = blogApi.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const fetchConfigAndLogs = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [cfgRes, logsRes] = await Promise.all([
        fetch('/api/n8n/config', { headers }),
        fetch('/api/n8n/logs', { headers })
      ]);
      if (cfgRes.ok) {
        const cfgData = await cfgRes.json();
        if (cfgData.config) setConfig(cfgData.config);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (Array.isArray(logsData.logs)) setLogs(logsData.logs);
      }
    } catch {
      notify('error', 'Erro ao carregar configurações e logs do n8n.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVpsFile = async (filename: string) => {
    setSelectedFile(filename);
    setLoadingFile(true);
    try {
      const res = await fetch(`/api/n8n/files/${filename}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setFileContent(data.content || '');
      } else {
        setFileContent('// Não foi possível carregar o arquivo do servidor.');
      }
    } catch {
      setFileContent('// Erro de rede ao carregar arquivo.');
    } finally {
      setLoadingFile(false);
    }
  };

  useEffect(() => {
    fetchConfigAndLogs();
    fetchVpsFile('install-vps.sh');
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/n8n/config', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao salvar');
      if (data.config) setConfig(data.config);
      notify('success', 'Configuração do Webhook n8n salva com sucesso!');
    } catch (err: any) {
      notify('error', err.message || 'Erro ao salvar configurações do n8n.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/n8n/test', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ webhookUrl: config.webhookUrl })
      });
      const data = await res.json();
      setTestResult(data);
      fetchConfigAndLogs();
      if (data.ok) {
        notify('success', `Webhook n8n respondeu OK (${data.latencyMs}ms)!`);
      } else {
        notify('error', 'Webhook n8n não respondeu. Verifique os detalhes abaixo.');
      }
    } catch {
      setTestResult({ ok: false, error: 'Erro ao executar teste contra o servidor.' });
      notify('error', 'Falha ao testar Webhook n8n.');
    } finally {
      setTesting(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      const res = await fetch('/api/n8n/logs', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setLogs([]);
        notify('success', 'Logs de disparo do n8n limpos.');
      }
    } catch {
      notify('error', 'Erro ao limpar logs.');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify('success', 'Copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadSelectedFile = () => {
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
        <RefreshCw className="w-6 h-6 text-blue-700 animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500">Carregando integração Consultor Virtual & n8n...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Status Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
              <Workflow className="w-3 h-3" /> Orquestração Local / VPS
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                config.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {config.enabled ? 'Webhook Ativo' : 'Modo Local'}
            </span>
          </div>
          <h2 className="font-display text-xl font-extrabold text-white">
            Consultor Virtual Estruturado + n8n Self-Hosted (VPS)
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Cada interação do Consultor Virtual no site dispara para o Webhook local do n8n rodando em Docker na sua VPS. Se o n8n estiver offline ou sendo atualizado, o site mantém o atendimento operando automaticamente via fallback de funil estruturado.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (typeof (window as any).openConsultorChat === 'function') {
              (window as any).openConsultorChat();
            } else {
              window.dispatchEvent(new CustomEvent('open-consultor-chat'));
            }
          }}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-blue-500/40 transition-all cursor-pointer shrink-0 flex items-center gap-2 self-start lg:self-auto"
        >
          <Play className="w-3.5 h-3.5 text-orange-400" />
          <span>Testar Widget no Navegador</span>
        </button>
      </div>

      {/* Main Grid: Webhook Settings + VPS Package */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Webhook Configuration & Live Ping */}
        <form
          onSubmit={handleSaveConfig}
          className="xl:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900">Conexão Webhook n8n</h3>
                <p className="text-[11px] text-slate-500">Endpoint POST chamado por /api/consultor/chat</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Habilitar disparo para n8n</span>
                <span className="text-[11px] text-slate-500">
                  Envia todas as etapas do funil ao fluxo n8n antes de responder
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig((p) => ({ ...p, enabled: e.target.checked }))}
                className="w-5 h-5 accent-blue-700 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                URL do Webhook n8n (VPS / Local)
              </label>
              <input
                type="url"
                required
                value={config.webhookUrl}
                onChange={(e) => setConfig((p) => ({ ...p, webhookUrl: e.target.value }))}
                placeholder="http://localhost:5678/webhook/oz-consultor"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <p className="text-[11px] text-slate-400">
                Na mesma VPS use <code className="font-mono text-slate-600">http://localhost:5678/webhook/oz-consultor</code> ou o nome do container Docker <code className="font-mono text-slate-600">http://oz_n8n:5678/webhook/oz-consultor</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400" /> Header de Autenticação
                </label>
                <input
                  type="text"
                  value={config.authHeaderName}
                  onChange={(e) => setConfig((p) => ({ ...p, authHeaderName: e.target.value }))}
                  placeholder="X-OZ-Webhook-Secret"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Token / Segredo (Opcional)
                </label>
                <input
                  type="password"
                  value={config.authHeaderValue}
                  onChange={(e) => setConfig((p) => ({ ...p, authHeaderValue: e.target.value }))}
                  placeholder="Segredo compartilhado"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Timeout (ms)
                </label>
                <input
                  type="number"
                  min={1000}
                  max={30000}
                  step={500}
                  value={config.timeoutMs}
                  onChange={(e) => setConfig((p) => ({ ...p, timeoutMs: Number(e.target.value) || 8000 }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <label className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-3 cursor-pointer mt-4 sm:mt-5">
                <input
                  type="checkbox"
                  checked={config.fallbackToLocalFunnel}
                  onChange={(e) => setConfig((p) => ({ ...p, fallbackToLocalFunnel: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Fallback automático se n8n estiver offline
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-100 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Salvar Configurações</span>
            </button>

            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={testing}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-400" /> : <Activity className="w-3.5 h-3.5 text-emerald-400" />}
              <span>Testar Webhook n8n</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`rounded-2xl p-4 text-xs border space-y-2 ${
                testResult.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {testResult.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  {testResult.ok ? 'Conexão estabelecida com n8n!' : 'n8n ainda não acessível neste endpoint'}
                </span>
                {typeof testResult.latencyMs === 'number' && (
                  <span className="font-mono text-[11px]">{testResult.latencyMs}ms</span>
                )}
              </div>
              {testResult.error && <p className="text-[11px] leading-relaxed">{testResult.error}</p>}
              {testResult.response && (
                <pre className="bg-slate-950 text-emerald-300 p-2.5 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36">
                  {typeof testResult.response === 'string'
                    ? testResult.response
                    : JSON.stringify(testResult.response, null, 2)}
                </pre>
              )}
            </div>
          )}
        </form>

        {/* Right: VPS Local Installation Package */}
        <div className="xl:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Pacote de Instalação Local na VPS (Docker)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Arquivos prontos em <code className="font-mono">/n8n/</code> para subir o n8n na sua VPS
                </p>
              </div>
            </div>
          </div>

          {/* 1-Line Quick Command */}
          <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 space-y-2 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold">
                Comando Único na VPS (Ubuntu/Debian)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard('chmod +x n8n/install-vps.sh && bash n8n/install-vps.sh', 'cmd')}
                className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedId === 'cmd' ? 'Copiado!' : 'Copiar comando'}</span>
              </button>
            </div>
            <code className="block font-mono text-xs text-emerald-400 break-all">
              chmod +x n8n/install-vps.sh && bash n8n/install-vps.sh
            </code>
            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              Depois que subir em <strong className="text-white">http://SEU_IP_VPS:5678</strong>, importe o arquivo{' '}
              <code className="text-orange-300 font-mono">oz-consultor-workflow.json</code> no n8n e ative a chave{' '}
              <strong className="text-emerald-400">Active</strong>.
            </p>
          </div>

          {/* File Selector Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {VPS_FILES.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => fetchVpsFile(file.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  selectedFile === file.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-orange-500" />
                <span>{file.label}</span>
              </button>
            ))}
          </div>

          {/* File Viewer + Copy/Download */}
          <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden min-h-[240px]">
            <div className="bg-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-mono truncate">n8n/{selectedFile}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(fileContent, 'file')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedId === 'file' ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadSelectedFile}
                  className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Baixar</span>
                </button>
              </div>
            </div>

            {loadingFile ? (
              <div className="flex-1 flex items-center justify-center p-6 text-slate-400 text-xs">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Carregando {selectedFile}...
              </div>
            ) : (
              <pre className="p-3.5 text-[11px] font-mono text-slate-200 overflow-auto max-h-64 leading-relaxed">
                {fileContent}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Dispatch Logs Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Histórico de Disparos Webhook n8n
            </h3>
            <p className="text-xs text-slate-500">
              Últimos {logs.length} eventos entre o Consultor Virtual do site e seu n8n local/VPS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchConfigAndLogs}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar</span>
            </button>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={handleClearLogs}
                className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Logs</span>
              </button>
            )}
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            Nenhum disparo registrado ainda. Clique em <strong>Testar Webhook n8n</strong> ou interaja com o Consultor Virtual.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-3">Horário</th>
                  <th className="py-2.5 px-3">Evento / Etapa</th>
                  <th className="py-2.5 px-3">Motor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Latência</th>
                  <th className="py-2.5 px-3">Resumo / Erro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.executedAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{log.event}</span>
                      <span className="ml-1.5 text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {log.step}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          log.engine === 'n8n-vps'
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.engine === 'test-ping'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {log.engine}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                          log.status === 'success' ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        {log.httpStatus ? `HTTP ${log.httpStatus}` : log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {log.latencyMs}ms
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600 max-w-xs truncate">
                      {log.errorMessage ? (
                        <span className="text-red-600 font-medium">{log.errorMessage}</span>
                      ) : (
                        log.payloadPreview
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
