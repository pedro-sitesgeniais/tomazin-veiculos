import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Constants } from '@/integrations/supabase/types';
import { Fuel, Settings2, Car } from 'lucide-react';

export function EnumsTab() {
  const { combustivel_type, cambio_type, carroceria_type } = Constants.public.Enums;

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Estas são listas fixas definidas no banco de dados. Para alterá-las, é necessário uma migração de banco de dados.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Combustíveis
            </CardTitle>
            <CardDescription>Tipos de combustível disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {combustivel_type.map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Câmbios
            </CardTitle>
            <CardDescription>Tipos de transmissão disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {cambio_type.map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Carrocerias
            </CardTitle>
            <CardDescription>Tipos de carroceria disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {carroceria_type.map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
