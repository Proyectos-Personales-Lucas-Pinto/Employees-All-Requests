describe("Testing get employees", () => {
    it("Test GET employees", () => { 
        var array = 
                cy.request({
                    method: 'GET',
                    url: 'https://restool-sample-app.herokuapp.com/api/employee',
                    form:true           
                }).then((response) => { 
                    expect(response.status).to.eq(200)
                    expect(response.body.items.name).to.not.be.null
                    return response.body.items.id          
                });

        cy.visit("https://dsternlicht.github.io/RESTool/#/employees")
        let idArray = []
        cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length.greaterThan',0)
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            
            cy.wrap($el).then((val) => {
                idArray.push(val.text());
                expect(array).include(val.text)                
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })   

    it("Test POST new employee", () => { 
        const uniqueSeed = Date.now().toString();       
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            form:true,
            body:{
                "isFired":false,
                "JobTitle":"Executive Producer",
                "name":uniqueSeed
            }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)            
            cy.viewport(1920,1080);
            cy.visit("https://dsternlicht.github.io/RESTool/#/employees")
            cy.log("name created :"+response.body.name)
            //cy.get('div>div:nth-child(3)>span').should('have.length.greaterThan',7)
            cy.get('td:nth-child(2) > span').should('have.length.greaterThan',2)                                                          
            cy.get('td:nth-child(2) > span').each(($el, index, $lis) => { 
                cy.log($el.text())
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            })  
            cy.wait(5000)    
            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/employee/'+ response.body.id            
            }).then((response) => { 
                expect(response.status).to.eq(200)        
                })            
        });       
    })
    
    it("Test PUT new employees", () => { 
        const uniqueSeed = Date.now().toString();
        let newLocation = "Argentina"      
        cy.request({
            method: 'PUT',
            //Agregar el ID a la URL
            url: 'https://restool-sample-app.herokuapp.com/api/employee/iknXbs4I6auZ',
            form: true,
            body:{
                isFired: true,
                jobTitle: "",
                name: newLocation
            }           
        })                            
    })       
})