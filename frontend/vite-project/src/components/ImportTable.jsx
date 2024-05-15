import * as React from 'react';
import Papa from 'papaparse';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axiosInstance from '../axios'

//header for allele 
//name,chrome,phenotype,source,isolation_name,notes,gene, mutagen, qualifiers, constructed_by

//header for plasmids
// position name DNAType create_at construced_by MTA drug_resistance vector StrainBackground reference short_description summary_of_construction

//header for strain <TODO
// strainName position geno_type date_entered isolation_number note source
class FileReader extends React.Component {
    constructor() {
      super();
      this.state = {
        csvfile: undefined,
        alleles: [],
      };
      this.updateData = this.updateData.bind(this);
      this.selected = "";
    }
    componentDidMount() {
      this.fetchAlleles();
    }
    fetchAlleles = async () => {
      try {
        const response = await axiosInstance.get('model/alleles/');
        this.setState({ alleles: response.data });
      } catch (error) {
        console.error('Failed to fetch alleles', error);
      }
    };

    handleChange = event => {
      this.setState({
        csvfile: event.target.files[0]
      });
    };

    handleRadioChange = event => {
      this.selected = event.target.value
    };
  
    importCSV = () => {
      const { csvfile } = this.state;
      Papa.parse(csvfile, {
        complete: this.transformData,
        header: true
      });
    };
      
    transformData = (result) => {
      if(this.selected==="plasmids")
      {
        // Define the header mapping
        const headerMapping = {
          'plasmid name': 'name',
          'position': 'position',
          'date entered': 'create_at',
          'constructed by/obtained from': 'constructed_by',
          'drug resistance': 'drug_resistance',
          'vector': 'vector',
          'reference': 'reference',
          'short description': 'short_description',
          'summary of construction': 'summary_of_construction',
          'sequence': 'sequence',
          'MTA': 'MTA',
          'DNAType': 'dna_type',
        };
      
        // Transform the data headers
        const transformedData = result.data.map((row) => {
          const transformedRow = {
            name: '',
            position: '',
            create_at: '',
            constructed_by: '',
            drug_resistance: '',
            vector: '',
            reference: '',
            short_description: '',
            summary_of_construction: '',
            sequence: '',
            MTA: '',
            dna_type: '',
          };
      
          Object.keys(row).forEach((inputHeader) => {
            const outputHeader = headerMapping[inputHeader];
            if (outputHeader) {
              transformedRow[outputHeader] = row[inputHeader];
            }
          });
      
          return transformedRow;
        });
    
      this.updateData(transformedData);
      }

      else if(this.selected==="alleles")
      {
        // Define the header mapping
        const headerMapping = {
          'allele': 'name',
          'chrom': 'chrome',
          'phenotype': 'phenotype',
          'source': 'source',
          'isolation name': 'isolation_name',
          'notes': 'notes',
          'gene': 'gene',
          'mutagen': 'mutagen',
          'qualifiers': 'qualifiers',
          'constructed_by':'constructed_by'
        };
      
        // Transform the data headers
        const transformedData = result.data.map((row) => {
          const transformedRow = {
            name:'',
            chrome:'',
            phenotype:'',
            source: '',
            isolation_name: '',
            notes: '',
            gene: '',
            mutagen: '',
            qualifiers: '',
            constructed_by:''
          };
      
          Object.keys(row).forEach((inputHeader) => {
            const outputHeader = headerMapping[inputHeader];
            if (outputHeader) {
              transformedRow[outputHeader] = row[inputHeader];
            }
          });
      
          return transformedRow;
        });
    
      this.updateData(transformedData);
      }
      else{ //strain
        // Define the header mapping
        const headerMapping = {
          'strain': 'name',
          'position': 'position',
          'isolation #': 'isolation_number',
          'source': 'source',
          'notes': 'notes',
          'genotype':'genotype'
        };
      
        // Transform the data headers
        const transformedData = result.data.map((row) => {
          const transformedRow = {
            name:'',
            position:'',
            isolation_number:'',
            source: '',
            notes: '',
            genotype:''
          };
      
          Object.keys(row).forEach((inputHeader) => {
            const outputHeader = headerMapping[inputHeader];
            if (outputHeader) {
              if (outputHeader === 'genotype') {
                const alleleIds = this.mapAlleleName(row[inputHeader]);
                transformedRow[outputHeader] = alleleIds;
              } else {
                transformedRow[outputHeader] = row[inputHeader];
              }
            }
          });
      
          return transformedRow;
        });
    
      this.updateData(transformedData);
      
      }
    };
    
    mapAlleleName = (alleleNames) => {
      const { alleles } = this.state;
      if (alleleNames) {
        const alleleNameList = alleleNames.split(',').map((name) => name.trim());
      return alleleNameList;
    }
    };
  
    //work for allele &plasmids
    updateData= (result) =>  {
      if(this.selected==='plasmids' || this.selected==='alleles'){
        var data =[];
          for (let i=0; i<result.length-1;i++){
              data.push(result[i]);
          }
        axiosInstance
            .post('/model/'+this.selected+'/', data) //data is array 
            .then((res) => {
                alert('imported successfully.');
                navigate('/model/'+this.selected+'/',); // Make sure navigate is properly imported
            })
            .catch((error) => {
                console.error('Failed to import', error);
                alert('Failed to import.');
            });
            this.selected ="";
        }

      else{ //strain
        
        let promises = [];
        for (let i=0; i<result.length-1;i++){
          const data = result[i];
          promises.push(
            axiosInstance
              .post('/model/'+this.selected+'/', [data]) //data is array 
                .then((res) => {
                    alert('imported successfully.');
                    // navigate('/model/'+this.selected+'/',); // Make sure navigate is properly imported
                })
                .catch((error) => {
                          console.error('Failed to import', error);
                          alert('Failed to import.');
                      })
              )
            }
          Promise.all(promises).then(() => console.log('all done'));   
      }
      this.selected="";
    }
    
    // display
    render() {
      console.log(this.state.csvfile);
      return (
        <form>
          <div>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Please choose a type :</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={this.handleRadioChange}
                value = {this.value}
              >
                <FormControlLabel value="strains" control={<Radio />} label="Strains" />
                <FormControlLabel value="alleles" control={<Radio />} label="Alleles" />
                <FormControlLabel value="plasmids" control={<Radio />} label="Plasmids" />
              </RadioGroup>
            </FormControl>
          </div>
          <div>
            <h2>Import CSV File!</h2>
            <input
              className="csv-input"
              type="file"
              ref={input => {
                this.filesInput = input;
              }}
              name="file"
              placeholder={null}
              onChange={this.handleChange}
            />
            <button onClick={this.importCSV}> Upload now!</button>
        </div>
        </form>
      );
    }
  }
  
  export default FileReader;