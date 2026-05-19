import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Mail, Smartphone, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NotificationSettings {
  days_before_due: number;
  app_notifications: boolean;
  email_notifications: boolean;
}

const Configuracoes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    days_before_due: 3,
    app_notifications: true,
    email_notifications: false,
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          days_before_due: data.days_before_due,
          app_notifications: data.app_notifications,
          email_notifications: data.email_notifications,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          days_before_due: settings.days_before_due,
          app_notifications: settings.app_notifications,
          email_notifications: settings.email_notifications,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações de notificações</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações de Vencimento
          </CardTitle>
          <CardDescription>
            Configure como deseja ser notificado sobre parcelas próximas do vencimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="days">Dias de antecedência para notificação</Label>
            <div className="flex items-center gap-2">
              <Input
                id="days"
                type="number"
                min={1}
                max={30}
                value={settings.days_before_due}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  days_before_due: Math.max(1, Math.min(30, parseInt(e.target.value) || 1))
                }))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">dias antes do vencimento</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="app-notifications" className="text-base font-medium cursor-pointer">
                    Notificações no App
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas diretamente no aplicativo
                  </p>
                </div>
              </div>
              <Switch
                id="app-notifications"
                checked={settings.app_notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  app_notifications: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer">
                    Notificações por E-mail
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes de vencimento por e-mail
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ 
                  ...prev, 
                  email_notifications: checked 
                }))}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
