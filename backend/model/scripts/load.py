import csv
import os.path
from model.models import Plasmid
from model.models import Allele
from model.models import Strain

#reference  : https://medium.com/@abiraj.rajendran/django-adding-initial-data-to-a-postgresql-database-from-external-csv-files-6f8c7c2346a6

def run() :
    base_dir = os.path.dirname(os.path.abspath(__file__))

    plasmid_file = os.path.join(base_dir, "plasmids_simple.csv")
    allele_file = os.path.join(base_dir, "alleles_simple.csv")
    strain_file = os.path.join(base_dir, "strain_simple.csv")
    
    run_plasmid(plasmid_file)
    run_allele(allele_file)
    run_strain(strain_file)

# def connectionSql(temp):
#     with connection.cursor() as cursor:
#         cursor.execute("select id from model_allele where gene_type = %s", [temp])
#         row = cursor.fetchone() #todo : change this to handle multiple
        
#     return row

#helper methods
def convert_date (date_string):
    if len(date_string)==0:
        return  None
    else:
        d=date_string[0:2]
        m=date_string[3:5]
        y=date_string[6:len(date_string)]
        return y+"-"+m+"-"+d
    
def convert_bool(input):
    if len(input)==0:
        return None
    elif input == "Yes":
        return True
    else : return False

def convert_index(index_string):
    index_list = index_string.split()
    return index_list

def combine_fridge(seventy, fifteen):
    return "70 : "+seventy+";"+"15: "+fifteen

def run_plasmid(filePath):
    file = open(filePath)
    read_file=csv.reader(file)

    # optional to erase existing values in table
    Plasmid.objects.all().delete()

    count = 1 # To avoid header values
    for record in read_file :
        if count ==1:
            pass
        else:
            
            #print(record)
            '''
            0: position
            1: plasmid name
            2: DNATYpe
            3: date entered
            4: contructed by
            5: MTA
            6 : drug resostance
            7: vector
            8: strainbackground
            9: reference
            10: short description
            11: summary
            '''
            #error for duplicate position 
            Plasmid.objects.create(position=record[0], name=record[1], create_at = convert_date(record[3]), constructed_by = record[4], drug_resistance=record[6], vector=record[7],
                                   reference=record[9], short_description=record[10], summary_of_construction = record[11]
                                   )
            
            
        count=count+1

def run_allele(filePath):
    file = open(filePath)
    read_file=csv.reader(file)

    # optional to erase existing values in table
    Allele.objects.all().delete()

    count = 1 # To avoid header values
    index = 0 
    for record in read_file :
        if count ==1:
            pass
        else:
            #print(record)
            '''
            0: allele name
            1: chrome
            2: phenotype
            3: source
            4: isolation name
            5: notes
            6 : gene
            7: mutagen
            8: qualifiers
            '''
            Allele.objects.create(name=record[0], chrome=record[1], phenotype = record[2], source = record[3], isolation_name=record[4], gene=record[6],
                                   mutagen=record[7], qualifiers=record[8], notes = record[5]
                                   )


        count=count+1
    

def run_strain(filePath):
    file = open(filePath)
    read_file=csv.reader(file)

    # optional to erase existing values in table
    Strain.objects.all().delete()

    count = 1 # To avoid header values
    index = 0 
    for record in read_file :
        if count ==1:
            pass
        else:
            #print(record)
            '''
            0: -70
            1: 15
            2-31:allele genotypes
            32 : background genotypes
            33: date entered
            34 : duplicate warning
            35: EG number
            36: EG global
            37: Erik
            38: freezer notes
            39-68: gene genotype
            69 : genotype
            70: genotype new
            71: genotype old
            72 : global 1
            73: isolation #
            74: lab designate
            75: lost check
            76:lost date
            77: lost person
            78: notes
            79: old ej generation
            80: position
            81: position former
            82: sent to 
            83: source
            84: strain 
            85: strain number
            86 : thwaed for
            87: useful mapping chr label
            88 :useful mapping chrs
            '''
            try:
                temp_strain = Strain.objects.create(name=record[84] ,
                                  position=combine_fridge(record[0],record[1]), 
                                  geno_type_old=" ".join(record[71].split()),
                                  date_entered=convert_date(record[33]), 
                                  isolation_number=record[73],
                                  lost_person=record[77],
                                  source = record[83],
                                  notes = record[78]
                                   )
                
                # remove huge space after column
                # this happens from the parsing csv file
                
                #Add 
                temp_allele = Allele.objects.get(gene_type = " ".join(record[70].split()))
                temp_strain.genotype.add(temp_allele)
                
            except Exception as e:
                #error handling
                #if there is problem then it will sip that row
                print(e)



        count=count+1

