from rest_framework import serializers
from .models import *


# https://www.django-rest-framework.org/api-guide/serializers/

# class ItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Item
#         fields = '__all__'

        
class PlasmidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plasmid
        fields = '__all__'

class AlleleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allele
        # fields = '__all__'
        fields = '__all__'
        
class StrainSerializer(serializers.ModelSerializer):
    alleles = serializers.PrimaryKeyRelatedField(many=True, queryset=Allele.objects.all())  # Assuming Allele model is imported
    class Meta:
        model = Strain
        fields = '__all__'
        depth = 1
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['alleles'] = [{'id': allele.id, 'name': allele.name, 'gene_type': allele.gene_type} for allele in instance.alleles.all()]
        return representation
    
class AlleleSimple(serializers.ModelSerializer):
    class Meta:
        model = Allele
        fields = ['id', 'name']
        

class FreezeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreezeTask
        fields = '__all__'

class ThawTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThawTask
        fields = '__all__' 