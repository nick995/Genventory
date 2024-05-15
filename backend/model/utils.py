from typing import List
from django.contrib.auth import get_user_model, get_user
from .models import *

class AlleleUtil:
    def search_allele_by_geno_type(self, alleles: List[str]) -> List[Allele]:
        """
            https://docs.djangoproject.com/en/5.0/topics/db/queries/#the-pk-lookup-shortcut
            search Alleles by geno_type
        """
        allele_list = []
        for allele in alleles:
            try:
                allele_list.append(Allele.objects.get(gene_type = allele))
            except:
                pass        
        # return Allele.objects.filter(gene_type__in=alleles) <= will not order by arbitrary
        return allele_list    
    def search_allele_by_geno_name(self, alleles: List[str]) -> List[Allele]:
        """
            search Alleles by name
        """
        return Allele.objects.filter(name__in=alleles)
        
    def generate_ordered_geno_type(self, alleles: List[Allele] ) -> List[str]:
        # print("=============generate start======================")
        geno_dic = {"I": [], "II": [], "III": [], "IV": [], "V": [], "X": [], "None": []}
        """
        case1: + / allele
        case2: allele / +
        case3: allele / allele
        case4: allele + / allele
        case5: allele / + allele
        case6: + allele / allele
        case7: allele / + allele
        case8: allele + / + allele
        """
        pre_allele = None
        
        for allele in alleles:
            if allele.name == "/":
                geno_dic[pre_allele.chrome].append(allele.name)
            else:
                if allele.chrome:
                    geno_dic[allele.chrome].append(allele.gene_type_without_chrome)
                    pre_allele = allele
                else:
                    geno_dic["None"].append(allele.gene_type_without_chrome)
                    pre_allele = allele

        ordered_geno = ""
        for key, value in geno_dic.items():
            if value:
                ordered_geno += " ".join(value)
                ordered_geno += f" {key} ; "
        return ordered_geno