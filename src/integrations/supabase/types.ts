export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      avaliacoes_veiculos: {
        Row: {
          aceite_lgpd: boolean
          ano_modelo: number
          cambio: string
          cidade: string
          combustivel: string
          cor: string
          cpf: string
          created_at: string
          email: string
          estado_geral: Database["public"]["Enums"]["estado_veiculo"]
          fotos: string[] | null
          id: string
          interesse: Database["public"]["Enums"]["interesse_avaliacao"]
          ipva_pago: boolean
          manual_chave_reserva: boolean
          marca: string
          melhor_horario: string | null
          modelo: string
          nome: string
          observacoes: string | null
          possui_multas: boolean
          protocolo: string
          quilometragem: number
          status: Database["public"]["Enums"]["avaliacao_status"]
          telefone: string
          uf: string
          unico_dono: boolean
          updated_at: string
          versao: string | null
        }
        Insert: {
          aceite_lgpd?: boolean
          ano_modelo: number
          cambio: string
          cidade: string
          combustivel: string
          cor: string
          cpf: string
          created_at?: string
          email: string
          estado_geral: Database["public"]["Enums"]["estado_veiculo"]
          fotos?: string[] | null
          id?: string
          interesse: Database["public"]["Enums"]["interesse_avaliacao"]
          ipva_pago?: boolean
          manual_chave_reserva?: boolean
          marca: string
          melhor_horario?: string | null
          modelo: string
          nome: string
          observacoes?: string | null
          possui_multas?: boolean
          protocolo: string
          quilometragem: number
          status?: Database["public"]["Enums"]["avaliacao_status"]
          telefone: string
          uf: string
          unico_dono?: boolean
          updated_at?: string
          versao?: string | null
        }
        Update: {
          aceite_lgpd?: boolean
          ano_modelo?: number
          cambio?: string
          cidade?: string
          combustivel?: string
          cor?: string
          cpf?: string
          created_at?: string
          email?: string
          estado_geral?: Database["public"]["Enums"]["estado_veiculo"]
          fotos?: string[] | null
          id?: string
          interesse?: Database["public"]["Enums"]["interesse_avaliacao"]
          ipva_pago?: boolean
          manual_chave_reserva?: boolean
          marca?: string
          melhor_horario?: string | null
          modelo?: string
          nome?: string
          observacoes?: string | null
          possui_multas?: boolean
          protocolo?: string
          quilometragem?: number
          status?: Database["public"]["Enums"]["avaliacao_status"]
          telefone?: string
          uf?: string
          unico_dono?: boolean
          updated_at?: string
          versao?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          id: string
          imagem_desktop: string
          imagem_mobile: string | null
          link_botao: string | null
          ordem: number | null
          posicao_texto: string | null
          subtitulo_overlay: string | null
          texto_botao: string | null
          titulo_interno: string
          titulo_overlay: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          imagem_desktop: string
          imagem_mobile?: string | null
          link_botao?: string | null
          ordem?: number | null
          posicao_texto?: string | null
          subtitulo_overlay?: string | null
          texto_botao?: string | null
          titulo_interno: string
          titulo_overlay?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          imagem_desktop?: string
          imagem_mobile?: string | null
          link_botao?: string | null
          ordem?: number | null
          posicao_texto?: string | null
          subtitulo_overlay?: string | null
          texto_botao?: string | null
          titulo_interno?: string
          titulo_overlay?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string | null
          grupo: string
          id: string
          ordem: number | null
          tipo: string | null
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          chave: string
          created_at?: string | null
          grupo: string
          id?: string
          ordem?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          chave?: string
          created_at?: string | null
          grupo?: string
          id?: string
          ordem?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      cores: {
        Row: {
          created_at: string
          hex_code: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          created_at?: string
          hex_code?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          created_at?: string
          hex_code?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      depoimentos: {
        Row: {
          ativo: boolean | null
          avaliacao: number | null
          created_at: string | null
          data: string | null
          depoimento: string
          foto_url: string | null
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          avaliacao?: number | null
          created_at?: string | null
          data?: string | null
          depoimento: string
          foto_url?: string | null
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          avaliacao?: number | null
          created_at?: string | null
          data?: string | null
          depoimento?: string
          foto_url?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      home_config: {
        Row: {
          config: Json | null
          id: string
          secao: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          id?: string
          secao: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          id?: string
          secao?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lead_interacoes: {
        Row: {
          arquivo_url: string | null
          created_at: string
          descricao: string
          id: string
          lead_id: string
          tipo: Database["public"]["Enums"]["interacao_tipo"]
          usuario_id: string | null
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          descricao: string
          id?: string
          lead_id: string
          tipo: Database["public"]["Enums"]["interacao_tipo"]
          usuario_id?: string | null
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          descricao?: string
          id?: string
          lead_id?: string
          tipo?: Database["public"]["Enums"]["interacao_tipo"]
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_interacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tarefas: {
        Row: {
          concluida: boolean
          created_at: string
          data_limite: string | null
          descricao: string
          id: string
          lead_id: string
          usuario_id: string | null
        }
        Insert: {
          concluida?: boolean
          created_at?: string
          data_limite?: string | null
          descricao: string
          id?: string
          lead_id: string
          usuario_id?: string | null
        }
        Update: {
          concluida?: boolean
          created_at?: string
          data_limite?: string | null
          descricao?: string
          id?: string
          lead_id?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_tarefas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tarefas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          cidade: string | null
          convertido_em: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          motivo_perda: string | null
          nome: string
          observacoes: string | null
          origem: Database["public"]["Enums"]["lead_origem"]
          responsavel_id: string | null
          status: Database["public"]["Enums"]["lead_status"]
          telefone: string
          uf: string | null
          updated_at: string
          valor_venda: number | null
          veiculo_id: string | null
          whatsapp: string | null
        }
        Insert: {
          cidade?: string | null
          convertido_em?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          motivo_perda?: string | null
          nome: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["lead_origem"]
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          telefone: string
          uf?: string | null
          updated_at?: string
          valor_venda?: number | null
          veiculo_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          cidade?: string | null
          convertido_em?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          motivo_perda?: string | null
          nome?: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["lead_origem"]
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          telefone?: string
          uf?: string | null
          updated_at?: string
          valor_venda?: number | null
          veiculo_id?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      marcas: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          logo_url: string | null
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          logo_url?: string | null
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          logo_url?: string | null
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      modelos: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          marca_id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          marca_id: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          marca_id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "modelos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      opcionais: {
        Row: {
          categoria: string
          created_at: string
          icone: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          categoria: string
          created_at?: string
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          categoria?: string
          created_at?: string
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      paginas: {
        Row: {
          conteudo: string | null
          created_at: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          slug: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          conteudo?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          conteudo?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nome: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          nome?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      simulacoes_financiamento: {
        Row: {
          created_at: string
          custo_financiamento: number
          id: string
          prazo: number
          taxa_juros: number
          total_pagar: number
          valor_entrada: number
          valor_financiado: number
          valor_parcela: number
          valor_veiculo: number
        }
        Insert: {
          created_at?: string
          custo_financiamento: number
          id?: string
          prazo: number
          taxa_juros: number
          total_pagar: number
          valor_entrada: number
          valor_financiado: number
          valor_parcela: number
          valor_veiculo: number
        }
        Update: {
          created_at?: string
          custo_financiamento?: number
          id?: string
          prazo?: number
          taxa_juros?: number
          total_pagar?: number
          valor_entrada?: number
          valor_financiado?: number
          valor_parcela?: number
          valor_veiculo?: number
        }
        Relationships: []
      }
      solicitacoes_credito: {
        Row: {
          aceite_lgpd: boolean
          cpf: string
          created_at: string
          email: string
          id: string
          nome: string
          possui_veiculo_troca: boolean
          renda_mensal: number
          simulacao_id: string | null
          telefone: string
          veiculo_interesse_id: string | null
        }
        Insert: {
          aceite_lgpd?: boolean
          cpf: string
          created_at?: string
          email: string
          id?: string
          nome: string
          possui_veiculo_troca?: boolean
          renda_mensal: number
          simulacao_id?: string | null
          telefone: string
          veiculo_interesse_id?: string | null
        }
        Update: {
          aceite_lgpd?: boolean
          cpf?: string
          created_at?: string
          email?: string
          id?: string
          nome?: string
          possui_veiculo_troca?: boolean
          renda_mensal?: number
          simulacao_id?: string | null
          telefone?: string
          veiculo_interesse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_credito_simulacao_id_fkey"
            columns: ["simulacao_id"]
            isOneToOne: false
            referencedRelation: "simulacoes_financiamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_credito_veiculo_interesse_id_fkey"
            columns: ["veiculo_interesse_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      status_veiculo: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      veiculo_imagens: {
        Row: {
          created_at: string
          id: string
          ordem: number
          principal: boolean
          url: string
          veiculo_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ordem?: number
          principal?: boolean
          url: string
          veiculo_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ordem?: number
          principal?: boolean
          url?: string
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculo_imagens_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculo_opcionais: {
        Row: {
          id: string
          opcional_id: string
          veiculo_id: string
        }
        Insert: {
          id?: string
          opcional_id: string
          veiculo_id: string
        }
        Update: {
          id?: string
          opcional_id?: string
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculo_opcionais_opcional_id_fkey"
            columns: ["opcional_id"]
            isOneToOne: false
            referencedRelation: "opcionais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculo_opcionais_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos: {
        Row: {
          ano: number
          ano_fabricacao: number | null
          ativo: boolean
          cambio: Database["public"]["Enums"]["cambio_type"]
          carroceria: Database["public"]["Enums"]["carroceria_type"]
          chassi: string | null
          codigo_interno: string | null
          combustivel: Database["public"]["Enums"]["combustivel_type"]
          condicao: Database["public"]["Enums"]["condicao_type"]
          cor: string | null
          created_at: string
          descricao: string | null
          descricao_curta: string | null
          destaque: boolean
          final_placa: number | null
          id: string
          imagem_principal: string | null
          imagens: string[] | null
          km: number
          marca: string
          meta_description: string | null
          meta_title: string | null
          modelo: string
          novo: boolean
          observacoes_internas: string | null
          opcionais: string[] | null
          placa: string | null
          portas: number | null
          preco: number
          preco_promocional: number | null
          renavam: string | null
          slug: string | null
          status: string
          updated_at: string
          versao: string | null
          video_youtube: string | null
        }
        Insert: {
          ano: number
          ano_fabricacao?: number | null
          ativo?: boolean
          cambio?: Database["public"]["Enums"]["cambio_type"]
          carroceria?: Database["public"]["Enums"]["carroceria_type"]
          chassi?: string | null
          codigo_interno?: string | null
          combustivel?: Database["public"]["Enums"]["combustivel_type"]
          condicao?: Database["public"]["Enums"]["condicao_type"]
          cor?: string | null
          created_at?: string
          descricao?: string | null
          descricao_curta?: string | null
          destaque?: boolean
          final_placa?: number | null
          id?: string
          imagem_principal?: string | null
          imagens?: string[] | null
          km?: number
          marca: string
          meta_description?: string | null
          meta_title?: string | null
          modelo: string
          novo?: boolean
          observacoes_internas?: string | null
          opcionais?: string[] | null
          placa?: string | null
          portas?: number | null
          preco: number
          preco_promocional?: number | null
          renavam?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
          versao?: string | null
          video_youtube?: string | null
        }
        Update: {
          ano?: number
          ano_fabricacao?: number | null
          ativo?: boolean
          cambio?: Database["public"]["Enums"]["cambio_type"]
          carroceria?: Database["public"]["Enums"]["carroceria_type"]
          chassi?: string | null
          codigo_interno?: string | null
          combustivel?: Database["public"]["Enums"]["combustivel_type"]
          condicao?: Database["public"]["Enums"]["condicao_type"]
          cor?: string | null
          created_at?: string
          descricao?: string | null
          descricao_curta?: string | null
          destaque?: boolean
          final_placa?: number | null
          id?: string
          imagem_principal?: string | null
          imagens?: string[] | null
          km?: number
          marca?: string
          meta_description?: string | null
          meta_title?: string | null
          modelo?: string
          novo?: boolean
          observacoes_internas?: string | null
          opcionais?: string[] | null
          placa?: string | null
          portas?: number | null
          preco?: number
          preco_promocional?: number | null
          renavam?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
          versao?: string | null
          video_youtube?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
      avaliacao_status:
        | "pendente"
        | "em_analise"
        | "proposta_enviada"
        | "concluido"
        | "cancelado"
      cambio_type: "Manual" | "Automático" | "CVT" | "Automatizado"
      carroceria_type:
        | "Sedan"
        | "Hatch"
        | "SUV"
        | "Picape"
        | "Conversível"
        | "Van"
      combustivel_type: "Flex" | "Gasolina" | "Diesel" | "Elétrico" | "Híbrido"
      condicao_type: "0KM" | "Seminovo"
      estado_veiculo: "Excelente" | "Bom" | "Regular" | "Precisa reparos"
      interacao_tipo:
        | "nota"
        | "ligacao"
        | "whatsapp"
        | "email"
        | "proposta"
        | "agendamento"
        | "visita"
      interesse_avaliacao: "Vender" | "Trocar por outro" | "Apenas avaliação"
      lead_origem:
        | "formulario_contato"
        | "interesse_veiculo"
        | "simulacao_financiamento"
        | "avaliacao_veiculo"
        | "whatsapp"
        | "telefone"
        | "indicacao"
        | "outros"
      lead_status:
        | "novo"
        | "em_atendimento"
        | "aguardando_cliente"
        | "proposta_enviada"
        | "negociacao"
        | "convertido"
        | "perdido"
        | "descartado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      avaliacao_status: [
        "pendente",
        "em_analise",
        "proposta_enviada",
        "concluido",
        "cancelado",
      ],
      cambio_type: ["Manual", "Automático", "CVT", "Automatizado"],
      carroceria_type: [
        "Sedan",
        "Hatch",
        "SUV",
        "Picape",
        "Conversível",
        "Van",
      ],
      combustivel_type: ["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"],
      condicao_type: ["0KM", "Seminovo"],
      estado_veiculo: ["Excelente", "Bom", "Regular", "Precisa reparos"],
      interacao_tipo: [
        "nota",
        "ligacao",
        "whatsapp",
        "email",
        "proposta",
        "agendamento",
        "visita",
      ],
      interesse_avaliacao: ["Vender", "Trocar por outro", "Apenas avaliação"],
      lead_origem: [
        "formulario_contato",
        "interesse_veiculo",
        "simulacao_financiamento",
        "avaliacao_veiculo",
        "whatsapp",
        "telefone",
        "indicacao",
        "outros",
      ],
      lead_status: [
        "novo",
        "em_atendimento",
        "aguardando_cliente",
        "proposta_enviada",
        "negociacao",
        "convertido",
        "perdido",
        "descartado",
      ],
    },
  },
} as const
