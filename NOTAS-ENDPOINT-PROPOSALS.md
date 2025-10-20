# 📝 Nota: Endpoint de Aplicación a Campañas

## 🚧 Estado Actual

El endpoint `POST /api/v1/talents/proposals` para aplicar a campañas **NO está implementado aún en el backend**.

---

## ✅ Lo que SÍ está implementado

### **UI Completa:**
- ✅ Modal de confirmación en `CampaignDetailScreen`
- ✅ Campo de mensaje opcional
- ✅ Validaciones de UI
- ✅ Flujo de navegación
- ✅ Toast de feedback

### **Código Preparado:**
- ✅ Servicio `applyCampaign()` en `src/services/proposals.ts`
- ✅ Tipos TypeScript definidos
- ✅ Integración con React Query lista
- ✅ Manejo de errores preparado

---

## 🔄 Flujo Actual (Simulado)

```
1. Usuario ve campaña
   ↓
2. Click "Aplicar a esta campaña"
   ↓
3. Modal se abre
   ↓
4. Usuario escribe mensaje (opcional)
   ↓
5. Click "Confirmar aplicación"
   ↓
6. Toast: "¡Aplicación registrada! (Funcionalidad pendiente en backend)"
   ↓
7. Redirect a HomeScreen
```

**No se hace llamada al backend.**

---

## 📋 Archivos Afectados

### **1. CampaignDetailScreen.tsx**
```typescript
const handleConfirmApply = () => {
  // TODO: Implementar cuando el endpoint esté disponible en el backend
  toast.success('¡Aplicación registrada! (Funcionalidad pendiente en backend)');
  setIsModalOpen(false);
  setApplicationMessage('');
  setTimeout(() => navigate('/'), 1000);
};
```

### **2. proposals.ts**
```typescript
export async function applyCampaign(
  _campaignId: number,
  _message?: string
): Promise<ApiResponse<ApplyCampaignResponse>> {
  // Endpoint no disponible aún en el backend
  throw new Error('Funcionalidad pendiente de implementación en el backend');
  
  /* CÓDIGO COMENTADO - Descomentar cuando el endpoint esté listo
  const url = buildUrl('/api/v1/talents/proposals');
  // ... resto del código
  */
}
```

---

## 🔧 Cómo Activar Cuando el Backend Esté Listo

### **Paso 1: Descomentar código en `proposals.ts`**
```typescript
export async function applyCampaign(
  campaignId: number,
  message?: string
): Promise<ApiResponse<ApplyCampaignResponse>> {
  const url = buildUrl('/api/v1/talents/proposals');
  devLog('[applyCampaign] request', { campaignId, message });

  const resp = await fetchWithAuthRetry(url, {
    method: 'POST',
    headers: { ...defaultHeaders },
    body: JSON.stringify({
      campaign_id: campaignId,
      message: message || '',
    }),
  });

  const data = await parseJson<ApiResponse<ApplyCampaignResponse>>(resp);
  devLog('[applyCampaign] response', data);

  if (!resp.ok) {
    const errorMessage = data?.meta?.message || `Request failed with status ${resp.status}`;
    throw new ApiError(errorMessage, resp.status, data);
  }

  return data;
}
```

### **Paso 2: Actualizar `CampaignDetailScreen.tsx`**
```typescript
// Importar useMutation y useQueryClient
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applyCampaign } from '../services/proposals';

// Dentro del componente:
const queryClient = useQueryClient();

const applyMutation = useMutation({
  mutationFn: () => applyCampaign(Number(id), applicationMessage),
  onSuccess: () => {
    toast.success('¡Aplicación enviada exitosamente!');
    setIsModalOpen(false);
    setApplicationMessage('');
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    queryClient.invalidateQueries({ queryKey: ['proposals'] });
    setTimeout(() => navigate('/'), 2000);
  },
  onError: (error: any) => {
    toast.error(error.message || 'Error al aplicar a la campaña');
  },
});

const handleConfirmApply = () => {
  applyMutation.mutate();
};
```

### **Paso 3: Actualizar botones con estados de carga**
```typescript
// Botón principal
<Button 
  variant="dark" 
  onClick={handleApplyClick}
  disabled={applyMutation.isPending}
>
  {applyMutation.isPending ? 'Aplicando...' : 'Aplicar a esta campaña'}
</Button>

// Botones del modal
<Button
  variant="light"
  onClick={() => setIsModalOpen(false)}
  disabled={applyMutation.isPending}
>
  Cancelar
</Button>
<Button
  variant="dark"
  onClick={handleConfirmApply}
  disabled={applyMutation.isPending}
>
  {applyMutation.isPending ? 'Enviando...' : 'Confirmar aplicación'}
</Button>

// Input
<Input
  label="Mensaje para la marca (opcional)"
  value={applicationMessage}
  onChange={(e) => setApplicationMessage(e.target.value)}
  disabled={applyMutation.isPending}
/>
```

---

## 🧪 Testing Cuando Esté Activo

### **Test 1: Aplicación Exitosa**
```bash
1. Ir a una campaña
2. Click "Aplicar a esta campaña"
3. Escribir mensaje
4. Click "Confirmar aplicación"
5. Ver toast de éxito
6. Redirect a home
7. Ir a "Mis Campañas" > Pendientes
8. Ver la nueva aplicación
```

### **Test 2: Error de Red**
```bash
1. DevTools > Network > Offline
2. Intentar aplicar
3. Ver toast de error
4. Modal permanece abierto
5. Volver Online
6. Reintentar
7. Aplicación exitosa
```

### **Test 3: Token Expirado**
```bash
1. Esperar a que expire el token
2. Aplicar a campaña
3. Ver refresh automático en logs
4. Aplicación exitosa sin intervención
```

---

## 📊 Endpoints Relacionados

### **Crear Propuesta (Pendiente):**
```
POST /api/v1/talents/proposals
Body: {
  campaign_id: number,
  message?: string
}
Response: {
  data: {
    proposal: {
      id: number,
      campaign_id: number,
      status: 'pending',
      created_at: string
    }
  }
}
```

### **Listar Propuestas (Funcionando):**
```
GET /api/v1/talents/proposals?status=pending|approved|rejected
Response: {
  data: {
    proposals: Proposal[]
  }
}
```

### **Detalle de Propuesta (Funcionando):**
```
GET /api/v1/talents/proposals/:id
Response: {
  data: {
    proposal: Proposal
  }
}
```

### **Cancelar Propuesta (Funcionando):**
```
DELETE /api/v1/talents/proposals/:id
Response: {
  meta: {
    message: "Proposal cancelled successfully"
  }
}
```

---

## 🎯 Comparación Mobile vs Web

### **Mobile (Completo):**
```
CampaignDetail
  ↓
ProposalDetails (botón "Postularme")
  ↓
AudienceStats (subir estadísticas)
  ↓
POST /api/v1/talents/proposals
```

### **Web (Simplificado):**
```
CampaignDetail
  ↓
Modal (mensaje opcional)
  ↓
POST /api/v1/talents/proposals (cuando esté listo)
```

**Decisión:** Mantener flujo simplificado sin subida de estadísticas en la web.

---

## ✅ Checklist de Activación

- [ ] Backend implementa `POST /api/v1/talents/proposals`
- [ ] Verificar estructura de request/response
- [ ] Descomentar código en `proposals.ts`
- [ ] Actualizar `CampaignDetailScreen.tsx`
- [ ] Agregar estados de carga
- [ ] Testing completo
- [ ] Actualizar documentación
- [ ] Remover este archivo

---

## 💡 Notas Adicionales

### **Por qué está comentado:**
El endpoint aún no existe en el backend del proyecto mobile, por lo que no tiene sentido hacer la llamada en la web.

### **Ventajas de tener la UI lista:**
- ✅ UX completa para testing
- ✅ Feedback visual del flujo
- ✅ Código preparado para activación rápida
- ✅ Sin cambios mayores cuando esté listo

### **Alternativas consideradas:**
1. ❌ No implementar nada → Mala UX
2. ❌ Mock completo con datos falsos → Confuso
3. ✅ UI completa + toast informativo → **Elegido**

---

## 📅 Última Actualización

**Fecha:** 17 de octubre, 2025  
**Estado:** Endpoint pendiente en backend  
**Próximo paso:** Esperar implementación en backend mobile

---

**Cuando el endpoint esté listo, seguir los pasos de activación y eliminar este documento.**
