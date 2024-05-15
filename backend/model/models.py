from django.db import models
from django.conf import settings
from django.db.models import JSONField  # If you're using PostgreSQL

class Plasmid(models.Model):
    position = models.CharField(max_length=255)                     # Exisiting position, should not be used as primary key.
    name = models.CharField(max_length=256,
                            )                         # name of Plasmid. isn't it suppsed to be primary key as well?
    dna_type = models.CharField(max_length =256, blank = True)      # DNA type such as "plasmid" or "bacteria only"
    create_at = models.DateField()         # Date of created
    # constructed_by = models.ForeignKey(settings.AUTH_USER_MODEL,
    #                                    on_delete=models.CASCADE,
    #                                    blank = True) 
    constructed_by = models.CharField(max_length =256, blank = True)  
    MTA = models.CharField(max_length = 256, blank = True)
    drug_resistance = models.CharField(max_length=255, blank=True)
    vector = models.CharField(max_length=255, blank=True)
    reference = models.CharField(max_length=255, blank=True)
    short_description = models.TextField(blank=True)
    summary_of_construction = models.TextField(blank=True)
    sequence = models.TextField(blank=True, null=True)

    
class Allele(models.Model):
    name = models.CharField(max_length=256)
    chrome = models.CharField(max_length=255, blank=True)
    phenotype = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=255, blank=True)
    isolation_name = models.CharField(max_length=255, blank=True)  # Fixed typo in the field name
    gene = models.CharField(max_length=255, blank=True)
    mutagen = models.CharField(max_length=255, blank=True)
    qualifiers = models.CharField(max_length=255, blank=True)
    constructed_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                       on_delete=models.CASCADE,
                                       blank = True,
                                       null= True) 
    
    notes = models.TextField(blank = True, null =True)
    
    #=================Automatically created====================
    #   Field for key
    gene_type = models.CharField(max_length = 256,
                                 unique = True,
                                 blank = True,
                                 null = True,)        
    #   Field for ordered_geno      
    gene_type_without_chrome = models.CharField(max_length = 256,
                                                blank = True,
                                                null = True)

    def save(self, *args, **kwargs):
        """
        Overriding save method to generate gene_type        
        Allels = self gene genotype 

        if allele (A) only has gene (B) = B(A)
        if allele (A) has gene (B) and qualifies (C): data case 6673
        allele = oxIs201
        gene = unc-18
        qualifiers = [UNC-18(R39C):GFP]
        unc-18(oxIs201[UNC-18(R39C):GFP])  
        B(A C)
        gene (allele qualifiers)
        if allele (A) has only qualifies = AC
        """
        if self.name and self.gene and self.qualifiers:
            self.gene_type = f"{self.gene}({self.name}{self.qualifiers})"
            self.gene_type_without_chrome = f"{self.gene}({self.name}{self.qualifiers})"
            if self.chrome:
                self.gene_type = f"{self.gene_type} {self.chrome}"
        elif self.name and self.gene:           
            self.gene_type = f"{self.gene}({self.name})"
            self.gene_type_without_chrome = f"{self.gene}({self.name})"

            if self.chrome:
                self.gene_type = f"{self.gene_type} {self.chrome}"
        else:            
            self.gene_type = f"{self.name}{self.qualifiers}"
            self.gene_type_without_chrome = f"{self.name}{self.qualifiers}"
            if self.chrome:
                self.gene_type = f"{self.gene_type} {self.chrome}"
        super().save(*args, **kwargs)

class Strain(models.Model):
    name = models.CharField(max_length=256, unique=True)
    position = models.CharField(max_length=255)
    # genotype = models.ManyToManyField(Allele, through='StrainAllele')
    alleles = models.ManyToManyField(Allele, through='StrainAllele')
    # geno_type_old = models.CharField(max_length=255, null=True, blank=True)
    date_entered = models.DateField(null=True, blank=True)
    isolation_number = models.CharField(max_length=255, null=True, blank=True)
    lost_person = models.CharField(max_length=255, null=True, blank=True)
    source = models.CharField(max_length=255, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    ordered_geno_type = models.TextField(blank=True, null=True)

"""
    Bridge table for later
"""
class StrainAllele(models.Model):
    strain = models.ForeignKey(Strain, on_delete=models.CASCADE)
    allele = models.ForeignKey(Allele, on_delete=models.CASCADE)



    # def save(self, *args, **kwargs):
    #     gene_types = [allele.gene_type for allele in self.genotype.all()]
        
        

class FreezeTask(models.Model):
    strain = models.CharField(max_length=100)
    requestor = models.CharField(max_length=100, blank=True)
    request_date = models.DateField(blank=True, null=True)
    submission_status = models.CharField(max_length=20, blank=True)
    freezing_status = models.CharField(max_length=20, blank=True)
    test_thaws_status = models.CharField(max_length=20, blank=True)
    thaw_check_status = models.CharField(max_length=20, blank=True)
    filed_in = models.CharField(max_length=100, blank=True)
    comments = models.TextField(blank=True)

    def __str__(self):
        return self.strain
   
class ThawTask(models.Model):
    request_date = models.DateField(blank=True, null=True)
    strain = models.CharField(max_length=100)
    requestor = models.CharField(max_length=255, blank=True)
    comments = models.TextField(blank=True)
    thaw_done = models.CharField(max_length=20, blank=True)
    refreeze = models.CharField(max_length=20, blank=True)
    current_location = models.JSONField(blank=True, default=list)

    def __str__(self):
        return self.strain


