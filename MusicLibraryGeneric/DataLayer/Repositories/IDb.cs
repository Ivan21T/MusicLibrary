namespace DataLayer;

public interface IDb<T,K>
{
    Task Create(T item);
    Task<T> Read(K id, bool useNavigationProperties = false, bool isReadOnly = false);
    Task <List<T>> ReadAll(bool useNavigationProperties = false,bool isReadOnly = false);
    Task Update(T entity,bool useNavigationProperties=false);
    Task Delete(K id);
}