from rest_framework import generics
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import (SAFE_METHODS, 
                                        IsAuthenticated,
                                        IsAuthenticatedOrReadOnly,
                                        BasePermission,
                                        IsAdminUser,
                                        DjangoModelPermissions)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.http import Http404
from django.contrib.auth import get_user_model, get_user
from typing import List
from .utils import *
# https://www.django-rest-framework.org/api-guide/generic-views/#retrieveupdatedestroyapiview

PROHIBIT_METHODS = ["DELETE"]
ADMIN_AND_STAFF_METHODS = ["POST", "PUT"]

class DeletePermission(BasePermission):
    message = 'Only admin can delete data'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True  
        elif request.method in PROHIBIT_METHODS:
            return request.user.is_authenticated and request.user.is_admin
        return False  

class IsAdminAndIsStaffOrReadOnly(BasePermission):
    message = 'Only staff and admin can create and edit'
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True  
        elif request.method in ADMIN_AND_STAFF_METHODS:
            return request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_admin)
        return False  
        


#   class based 
class Plasmids(APIView, DeletePermission):
    permission_classes = [IsAdminAndIsStaffOrReadOnly]
    def get(self, request):
        plasmids = Plasmid.objects.all()
        serializer_class = PlasmidSerializer(plasmids, many=True)
        return Response(serializer_class.data)

    def post(self, request):
        print(request.data)
        serializer = PlasmidSerializer(data=request.data, many=True)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlasmidDetail(APIView, DeletePermission):
    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [DeletePermission()]
        else:
            return [IsAdminAndIsStaffOrReadOnly()]
        
    def get_object(self, pk):
        try:
            return Plasmid.objects.get(pk=pk)
        except Plasmid.DoesNotExist:
            raise Http404
    def get(self, request, pk, format=None):
        Plasmid = self.get_object(pk)
        serializer = PlasmidSerializer(Plasmid)
        return Response(serializer.data)
    def put(self, request, pk, format=None):
        Plasmid = self.get_object(pk)
        serializer = PlasmidSerializer(Plasmid, data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk, format=None):
        plasmid = self.get_object(pk)
        plasmid.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)      

class Alleles(APIView):
    permission_classes = [IsAdminAndIsStaffOrReadOnly]

    def get(self, request):
        alleles = Allele.objects.all()
        serializer_class = AlleleSerializer(alleles, many=True)
        
        return Response(serializer_class.data)

    def post(self, request):
        print(request.data)
        serializer = AlleleSerializer(data=request.data, many=True)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlleleDetail(APIView):

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [DeletePermission()]
        else:
            return [IsAdminAndIsStaffOrReadOnly()]
        
    def get_object(self, pk):
        try:
            return Allele.objects.get(pk=pk)
        except Allele.DoesNotExist:
            raise Http404
    def get(self, request, pk, format=None):
        Allele = self.get_object(pk)
        serializer = AlleleSerializer(Allele)
        return Response(serializer.data)
    def put(self, request, pk, format=None):
        Allele = self.get_object(pk)
        serializer = AlleleSerializer(Allele, data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        allele = self.get_object(pk)
        allele.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)     
    
class Strains(APIView):
    permission_classes = [IsAdminAndIsStaffOrReadOnly]

    def get(self, request):
        strains = Strain.objects.all()
        serializer_class = StrainSerializer(strains, many=True)
        return Response(serializer_class.data)

    def post(self, request):
        util = AlleleUtil()
        request_data = request.data
        print(request.data)
        #   user will search by allele's name but we need to get allele's gene_type
        allele_objects = util.search_allele_by_geno_type(request_data[0]["genotype"])       
        #   concatenate 

        generated = util.generate_ordered_geno_type(allele_objects)

        #   Get allele object's pk and store it since it's m to m
        request_data[0]["alleles"] = [allele.pk for allele in allele_objects]
        
        #   this ordered_geno_type should be displayed to user
        request_data[0]["ordered_geno_type"] = generated

        print(request_data[0])
        serializer = StrainSerializer(data=request_data , many=True)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StrainDetail(APIView):

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [DeletePermission()]
        else:
            return [IsAdminAndIsStaffOrReadOnly()]
   
    def get_object(self, pk):
        try:
            return Strain.objects.get(pk=pk)
        except Strain.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None):
        strain = self.get_object(pk)
        serializer = StrainSerializer(strain)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        strain = self.get_object(pk)
        serializer = StrainSerializer(strain, data=request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        strain = self.get_object(pk)
        strain.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  

'''
class FreezeView(APIView):
    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [DeletePermission()]
        else:
            return [IsAdminAndIsStaffOrReadOnly()]

    def get(self, request, format=None):
        freezes = Freeze.objects.all()
        serializer = FreezeSerializer(freezes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = FreezeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        try:
            freeze = Freeze.objects.get(pk=pk)
        except Freeze.DoesNotExist:
            raise Http404
        serializer = FreezeSerializer(freeze, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try:
            freeze = Freeze.objects.get(pk=pk)
        except Freeze.DoesNotExist:
            raise Http404
        freeze.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
'''
class FreezeTaskViewSet(viewsets.ModelViewSet):
    queryset = FreezeTask.objects.all()
    serializer_class = FreezeTaskSerializer

class ThawTaskViewSet(viewsets.ModelViewSet):
    queryset = ThawTask.objects.all()
    serializer_class = ThawTaskSerializer