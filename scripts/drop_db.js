toDelete = ['channels', 'clinics', 'teams']
for (var i=0; i< toDelete.length; i++){
  db[toDelete[i]].drop()
}
