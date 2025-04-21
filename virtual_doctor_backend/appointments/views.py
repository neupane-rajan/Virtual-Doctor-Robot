from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Doctor, Appointment
from .serializers import DoctorSerializer, AppointmentSerializer

class EmergencyDoctorListView(generics.ListAPIView):
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Doctor.objects.filter(is_available_for_emergency=True)

class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user).order_by('-created_at')

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        # Users can only update certain fields, not the status
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Remove status from data if present (only admin should update status)
        data = request.data.copy()
        if 'status' in data:
            data.pop('status')
            
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)