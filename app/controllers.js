    angular.module("ModuloSWAPI")
    .controller("IndexCtrl", function ($scope, $http, $q) {
        $scope.titulo = "Desafio Trinks Star Wars API";
        $scope.strBusca = "";
        $scope.tiposBusca = ["Filme", "Personagem"];        
        $scope.tipoSelecionado = "Filme";
        $scope.resultados = new Array();
        $scope.filme = new Array();
        $scope.personagensFilme = new Array();
        $scope.filmesPersonagem = new Array();
        var TAM = 0;
        $scope.loaderPersonagensModal = true;
        $scope.paginacao = { total: 0, posterior: "", anterior: "" };
        

        $scope.buscarResultados = function(str) {
            $scope.resultados.splice(0);
            if(str.trim().length > 1) {
                let url = "";
                if($scope.tipoSelecionado === "Filme") {
                    url = 'https://swapi.co/api/films/?search=' + str;
                    requestResponseGET(url);     
                }
                else if($scope.tipoSelecionado === "Personagem") {
                    url = 'https://swapi.co/api/people/?search=' + str;
                    $http.get(url)
                    .then(
                        function (response) {
                            console.log(response.data.results);
                            for(let i=0 ; i<response.data.results.length ; i++) {
                                for(let j=0 ; j<response.data.results[i].films.length ; j++) {
                                    let url = response.data.results[i].films[j];
                                    listarPersonagemDaBuscaPersonagem(url);
                                }
                            }
                        }).catch(
                        function (error) {
                            console.log(error);
                        });                         
                }      
            }
            else
                resetarResultadosScope();
        };

        function listarPersonagemDaBuscaFilme(url) {
            var deferred = $q.defer();    
            $http.get(url).then(function(data,status,headers,config) {
                deferred.resolve(data);
            })
            .catch(function(data,status,headers,config) {
                deferred.reject(status);
            });
        
            deferred.promise.then(function(resolve) {
                if($scope.personagensFilme.length === TAM-1)
                    $scope.loaderPersonagensModal = false;
                //console.log("Response: " + resolve.data.name);
                $scope.personagensFilme.push(resolve.data.name);
                return resolve;
            }, function(reject) {
                alert('Erro: ' + reject);
            });
        }

        function listarPersonagemDaBuscaPersonagem(url) {
            var deferred = $q.defer();    
            $http.get(url).then(function(data,status,headers,config) {
                deferred.resolve(data);
            })
            .catch(function(data,status,headers,config){
                deferred.reject(status);
            });
        
            deferred.promise.then(function(resolve) {
                //console.log("Response: " + resolve.data);
                let filmeExiste = $scope.resultados.some(function(e) { return e.title === resolve.data.title; });
                if(!filmeExiste)
                    $scope.resultados.push(resolve.data);
                //console.log("$scope.resultados: " + $scope.resultados);
                return resolve;
            }, function(reject) {
                alert('Erro: ' + reject);
            });
        }        

        function requestResponseGET(url) {
            $http.get(url)
            .then(
                function (response) {
                    $scope.resultados = response.data.results;
                    $scope.paginacao = { 
                        total: response.data.count,
                        posterior: response.data.next,
                        anterior: response.data.previous
                    };
                    //console.log(response.data.results);
                }).catch(
                function (error) {
                    console.log(error);
                }); 
        }

        $scope.mudarTipoBusca = function() {
            resetarResultadosScope();
            $scope.strBusca = "";
        };

        function resetarResultadosScope() {
            $scope.resultados.splice(0);
            $scope.paginacao = { total: 0, posterior: "", anterior: "" };
        };

        $scope.preencherModal = function(filme) {
            $scope.loaderPersonagensModal = true;
            $scope.personagensFilme.splice(0);
            $scope.filme = filme;
            TAM = (filme.characters.length < 3 ? filme.characters.length : 3);
            for(let i=0 ; i<TAM ; i++) {
                let url = filme.characters[i];
                listarPersonagemDaBuscaFilme(url);
            }
            console.log($scope.filme);
        };

        $scope.avancarPagina = function() {
            if($scope.paginacao.posterior !== null 
                && $scope.paginacao.posterior !== undefined
                && $scope.paginacao.posterior !== "")
                requestResponseGET($scope.paginacao.posterior);
        };

        $scope.voltarPagina = function() {
            if($scope.paginacao.anterior !== null 
                && $scope.paginacao.anterior !== undefined
                && $scope.paginacao.anterior !== "")
                requestResponseGET($scope.paginacao.anterior);
        };
    })    