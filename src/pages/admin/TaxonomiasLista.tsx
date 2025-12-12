import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, Car, Palette, Settings2, Zap, Cog, Package, CheckCircle } from 'lucide-react';
import { MarcasTab } from '@/components/admin/taxonomias/MarcasTab';
import { ModelosTab } from '@/components/admin/taxonomias/ModelosTab';
import { CoresTab } from '@/components/admin/taxonomias/CoresTab';
import { OpcionaisTab } from '@/components/admin/taxonomias/OpcionaisTab';
import { StatusTab } from '@/components/admin/taxonomias/StatusTab';
import { EnumsTab } from '@/components/admin/taxonomias/EnumsTab';

export default function TaxonomiasLista() {
  const [activeTab, setActiveTab] = useState('marcas');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Taxonomias</h1>
          <p className="text-muted-foreground">Gerencie marcas, modelos, cores e outras categorias</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="marcas" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Marcas</span>
            </TabsTrigger>
            <TabsTrigger value="modelos" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Modelos</span>
            </TabsTrigger>
            <TabsTrigger value="cores" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Cores</span>
            </TabsTrigger>
            <TabsTrigger value="opcionais" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Opcionais</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Status</span>
            </TabsTrigger>
            <TabsTrigger value="enums" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              <span className="hidden sm:inline">Outros</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marcas" className="mt-6">
            <MarcasTab />
          </TabsContent>

          <TabsContent value="modelos" className="mt-6">
            <ModelosTab />
          </TabsContent>

          <TabsContent value="cores" className="mt-6">
            <CoresTab />
          </TabsContent>

          <TabsContent value="opcionais" className="mt-6">
            <OpcionaisTab />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <StatusTab />
          </TabsContent>

          <TabsContent value="enums" className="mt-6">
            <EnumsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
