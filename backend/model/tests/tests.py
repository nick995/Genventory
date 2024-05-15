from django.test import TestCase
from ..models import Plasmid, Strain, Allele
from users.models import NewUser


class AlleleTest(TestCase):
    def setUp(self):

        """
        Allele has several special cases
        
        1. Only gene
        2. Only qualifiers
        3. gene and qualifiers
        4. chrom does not exist
        
        ==============================
        
        chrome has several cases as well
        
        1. only one Roman,
        2. Two Roman such as III;V
        3. III;f
        4. From old data, I(R) R stands for right, L stands for left.
        5. Not exists
        """
        
        #   create superuser
        NewUser.objects.create(
            email = "admin.admin.com",
            user_name = "mingyu",
            is_staff = True,
            is_active = True,
            is_admin = True,
        )
        
        
        user = NewUser.objects.get(user_name="mingyu")
        
        #   the case allele and gene are exisiting
        Allele.objects.create(name= "vs100",
                              chrome= "X",
                              phenotype= "",
                              source = "",
                              isolation_name="",
                              gene= "dop-1",
                              mutagen= "TMP/UV",
                              qualifiers = "",
                              constructed_by = user
                              )
    

        #   the case allele and qualifiers are exisiting
        Allele.objects.create(name= "oxIs69",
                              chrome= "IV",
                              phenotype= "rescue of unc-18, gfp in intestine",
                              source = "Rob Weimer",
                              isolation_name="Ja",
                              gene= "",
                              mutagen= "xray",
                              qualifiers = "[unc-18+; int:GFP]",
                              constructed_by = user
                              )
 
         #   the case allele, gene, and qualifiers are exisiting
        Allele.objects.create(name= "ox846",
                              chrome= "V",
                              phenotype= "rescue of unc-18, gfp in intestine",
                              source = "Edward Hujber",
                              isolation_name="J116",
                              gene= "daam-1",
                              mutagen= "crispr",
                              qualifiers = "[daam-1::FLPon::AID::GFP]",
                              constructed_by = user
        )
        
        # case 2-5 only qualifiers / no chrome no gene
        Allele.objects.create(name= "oxEx2084",
                              chrome= "",
                              phenotype= "Red and green neurons in the nerve ring. ",
                              source = "Yueqi Wang",
                              isolation_name="467M8X",
                              gene= "",
                              mutagen= "",
                              qualifiers = "[Pglr-1::GCaMP6s_stop::operon-mCherry-unc54utr]",
                              constructed_by = user
                              )   
        
    #   the case allele and gene are exisiting
    def test_allele_gene(self):
        
        allele = Allele.objects.get(name= "vs100")
        self.assertEqual(allele.gene_type, "dop-1(vs100) X")
        self.assertEqual(allele.constructed_by.user_name, "mingyu" )

    #   the case allele and qualifiers are exisiting
    def test_allele_quali(self):
    
        allele = Allele.objects.get(name= "oxIs69")
        self.assertEqual(allele.gene_type, "oxIs69[unc-18+; int:GFP] IV")
        self.assertEqual(allele.constructed_by.user_name, "mingyu" )

    #   the case allele, gene, and qualifiers are exisiting
    def test_allele_gene_quali(self):
        
        allele = Allele.objects.get(name= "ox846")
        self.assertEqual(allele.gene_type, "daam-1(ox846[daam-1::FLPon::AID::GFP]) V")
        self.assertEqual(allele.constructed_by.user_name, "mingyu" )  

    def test_allele_gene_quali_no_chrom(self):
        
        allele = Allele.objects.get(name= "oxEx2084")
        self.assertEqual(allele.gene_type, "oxEx2084[Pglr-1::GCaMP6s_stop::operon-mCherry-unc54utr]")
        self.assertEqual(allele.constructed_by.user_name, "mingyu" ) 
    

class StrainTest(TestCase):
    def setUp(self):

        """
        Allele has several special cases
        
        1. Only gene
        2. Only qualifiers
        3. gene and qualifiers
        4. chrom does not exist
        
        ==============================
        
        chrome has several cases as well
        
        1. only one Roman,
        2. Two Roman such as III;V
        3. III;f
        4. From old data, I(R) R stands for right, L stands for left.
        5. Not exists
        """
        
        """
        
        Strain concatenation rule
        
        ced-4(n1416) III ; egl-1(n986dm) V                            
        
        """
        
        #   create superuser
        NewUser.objects.create(
            email = "admin.admin.com",
            user_name = "mingyu",

            is_staff = True,
            is_active = True,
            is_admin = True,
        )
        
        NewUser.objects.create(
            email = "Matt.Matt.com",
            user_name = "Matt",
            is_staff = False,
            is_active = True,
            is_admin = True,
        )
        
        user = NewUser.objects.get(user_name="mingyu")
        
        #   the case allele and gene are exisiting
        Allele.objects.create(name= "vs100",
                              chrome= "X",
                              phenotype= "",
                              source = "",
                              isolation_name="",
                              gene= "dop-1",
                              mutagen= "TMP/UV",
                              qualifiers = "",
                              constructed_by = user
                              )
    

        #   the case allele and qualifiers are exisiting
        Allele.objects.create(name= "oxIs69",
                              chrome= "IV",
                              phenotype= "rescue of unc-18, gfp in intestine",
                              source = "Rob Weimer",
                              isolation_name="Ja",
                              gene= "",
                              mutagen= "xray",
                              qualifiers = "[unc-18+; int:GFP]",
                              constructed_by = user
                              )
 
         #   the case allele, gene, and qualifiers are exisiting
        Allele.objects.create(name= "ox846",
                              chrome= "V",
                              phenotype= "rescue of unc-18, gfp in intestine",
                              source = "Edward Hujber",
                              isolation_name="J116",
                              gene= "daam-1",
                              mutagen= "crispr",
                              qualifiers = "[daam-1::FLPon::AID::GFP]",
                              constructed_by = user
        )
        
        # case 2-5 only qualifiers / no chrome no gene
        Allele.objects.create(name= "oxEx2084",
                              chrome= "",
                              phenotype= "Red and green neurons in the nerve ring. ",
                              source = "Yueqi Wang",
                              isolation_name="467M8X",
                              gene= "",
                              mutagen= "",
                              qualifiers = "[Pglr-1::GCaMP6s_stop::operon-mCherry-unc54utr]",
                              constructed_by = user
                              )   
        
        # alleles for testing strain # 2238
        Allele.objects.create(name= "n1416",
                              chrome= "III",
                              phenotype= "absence of cell death",
                              source = "JY",
                              isolation_name="ced4(d)#143Ba3",
                              gene= "ced-4",
                              mutagen= "spont. from TR679",
                              qualifiers = "",
                              constructed_by = user
                              )   
        # alleles for testing strain # 1811
        Allele.objects.create(name= "n986",
                              chrome= "V",
                              phenotype= "Egl",
                              source = "CD",
                              isolation_name="19.7Bi4f",
                              gene= "egl-1",
                              mutagen= "ems",
                              qualifiers = "dm",
                              constructed_by = user
                              )
        # Strain 21 mimicking   
    def test_strain_create(self):

        allele1 = Allele.objects.get(name="n1416")
        allele2 = Allele.objects.get(name="n986")

        # Create the Strain object
        strain = Strain.objects.create(
            name="MT3315",
            position="4",
            isolation_number="",
            source="JY",
            notes="n1416=insertion if reverts then will be Egl since ced-4 suppresses egl-1",
            # genotype= ["zyg-1(b1ts,mm) II", "unc-52(e1421) II"]

        )
        # https://docs.djangoproject.com/en/2.2/topics/db/examples/many_to_many/
        
        strain.alleles.add(allele1, allele2)

        strain = Strain.objects.get(name="MT3315")
        # print("\n\n")
        # print(allele1.gene_type)
        # print(allele2.gene_type)
        # print(" ".join([allele.gene_type for allele in strain.genotype.all()]))
        # print("\n\n")

        self.assertEqual(" ".join([allele.gene_type for allele in strain.alleles.all()]),
                         f"{allele1.gene_type} {allele2.gene_type}")
        
        # print("Name:", strain.name)
        # print("Position:", strain.position)
        # print("Isolation Number:", strain.isolation_number)
        # print("Source:", strain.source)
        # print("Sequence:", strain.sequence)
        # print("Notes:", strain.notes)
        # print("Genotype:", "".join([allele.gene_type for allele in strain.genotype.all()]))
        # print()